import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'

const canvas = document.querySelector('#viewer')
const fileInput = document.querySelector('#fileInput')
const status = document.querySelector('#status')
const dropZone = document.querySelector('#dropZone')
const resetButton = document.querySelector('#resetViewBtn')
const wireframeButton = document.querySelector('#wireframeBtn')

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0f172a)
const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100000)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 2))
const keyLight = new THREE.DirectionalLight(0xffffff, 2)
keyLight.position.set(5, 8, 5)
scene.add(keyLight)
const grid = new THREE.GridHelper(30, 30, 0x3b82f6, 0x374151)
scene.add(grid)

let currentModel = null
let wireframe = false
let objectUrls = []
let loadId = 0

const setStatus = (message) => { status.textContent = message }
const ext = (file) => file.name.toLowerCase().split('.').pop()
const trackUrl = (file) => { const url = URL.createObjectURL(file); objectUrls.push(url); return url }
const revokeUrls = () => { objectUrls.forEach((url) => URL.revokeObjectURL(url)); objectUrls = [] }

function disposeModel(object) {
  object.traverse((node) => {
    if (node.geometry) node.geometry.dispose()
    if (!node.material) return
    for (const material of (Array.isArray(node.material) ? node.material : [node.material])) {
      Object.values(material).forEach((value) => value?.isTexture && value.dispose())
      material.dispose()
    }
  })
}

function clearModel() {
  if (currentModel) { scene.remove(currentModel); disposeModel(currentModel); currentModel = null }
  revokeUrls()
}

function fitCamera(object) {
  const box = new THREE.Box3().setFromObject(object)
  if (box.isEmpty()) return
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxSize = Math.max(size.x, size.y, size.z)
  const distance = maxSize / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)))
  camera.near = Math.max(maxSize / 10000, 0.001)
  camera.far = Math.max(maxSize * 100, 1000)
  camera.position.copy(center).add(new THREE.Vector3(distance * 1.2, distance * 0.8, distance * 1.2))
  controls.target.copy(center)
  controls.update()
  grid.position.y = box.min.y
  grid.scale.setScalar(Math.max(maxSize / 15, 1))
}

function addModel(object, message, id) {
  if (id !== loadId) { disposeModel(object); return }
  clearModel()
  currentModel = object
  scene.add(object)
  fitCamera(object)
  setWireframe(wireframe)
  setStatus(message)
}

function fail(error, id) {
  if (id !== loadId) return
  console.error(error)
  revokeUrls()
  setStatus('Impossible de charger ce fichier. Consultez la console du navigateur.')
}

function managerFor(files) {
  const byName = new Map(files.map((file) => [file.name.toLowerCase(), file]))
  const manager = new THREE.LoadingManager()
  manager.setURLModifier((url) => {
    const name = decodeURIComponent(url).split(/[\\/]/).pop().toLowerCase()
    const file = byName.get(name)
    return file ? trackUrl(file) : url
  })
  return manager
}

function loadOBJ(files, file, id) {
  const manager = managerFor(files)
  const mtl = files.find((item) => ext(item) === 'mtl')
  const finish = (materials) => {
    if (id !== loadId) return
    const loader = new OBJLoader(manager)
    if (materials) { materials.preload(); loader.setMaterials(materials) }
    loader.load(trackUrl(file), (object) => addModel(object, `OBJ chargé : ${file.name}`, id), undefined, (error) => fail(error, id))
  }
  if (!mtl) return finish(null)
  new MTLLoader(manager).load(trackUrl(mtl), finish, undefined, (error) => fail(error, id))
}

function loadGLTF(files, file, id) {
  const manager = managerFor(files)
  new GLTFLoader(manager).load(trackUrl(file), (gltf) => addModel(gltf.scene, `${ext(file).toUpperCase()} chargé : ${file.name}`, id), undefined, (error) => fail(error, id))
}

function loadFBX(file, id) {
  new FBXLoader().load(trackUrl(file), (object) => addModel(object, `FBX chargé : ${file.name}`, id), undefined, (error) => fail(error, id))
}

function loadSTL(file, id) {
  new STLLoader().load(trackUrl(file), (geometry) => {
    if (id !== loadId) { geometry.dispose(); return }
    geometry.computeVertexNormals()
    addModel(new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x9ad9ff, roughness: 0.65, metalness: 0.15 })), `STL chargé : ${file.name}`, id)
  }, undefined, (error) => fail(error, id))
}

function loadFiles(fileList) {
  const files = [...fileList]
  const main = files.find((file) => ['obj', 'fbx', 'gltf', 'glb', 'stl'].includes(ext(file)))
  if (!main) { setStatus('Sélectionnez un fichier OBJ, FBX, GLB, GLTF ou STL.'); return }
  loadId += 1
  const id = loadId
  clearModel()
  setStatus(`Chargement : ${main.name}`)
  if (ext(main) === 'obj') loadOBJ(files, main, id)
  else if (['gltf', 'glb'].includes(ext(main))) loadGLTF(files, main, id)
  else if (ext(main) === 'fbx') loadFBX(main, id)
  else loadSTL(main, id)
}

function setWireframe(enabled) {
  wireframe = enabled
  wireframeButton.textContent = enabled ? 'Matériaux' : 'Fil de fer'
  currentModel?.traverse((node) => {
    if (!node.material) return
    for (const material of (Array.isArray(node.material) ? node.material : [node.material])) material.wireframe = enabled
  })
}

fileInput.addEventListener('change', (event) => loadFiles(event.target.files))
resetButton.addEventListener('click', () => currentModel && fitCamera(currentModel))
wireframeButton.addEventListener('click', () => setWireframe(!wireframe))
for (const eventName of ['dragenter', 'dragover']) document.body.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('visible') })
for (const eventName of ['dragleave', 'drop']) document.body.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('visible') })
document.body.addEventListener('drop', (event) => loadFiles(event.dataTransfer.files))

function resize() {
  const width = Math.max(canvas.clientWidth, 1)
  const height = Math.max(canvas.clientHeight, 1)
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()
function animate() { requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera) }
animate()

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js?module'
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/OBJLoader.js?module'
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/MTLLoader.js?module'
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FBXLoader.js?module'
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js?module'
import { STLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/STLLoader.js?module'

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

function setStatus(message) { status.textContent = message }
function extension(file) { return file.name.toLowerCase().split('.').pop() }

function revokeUrls() {
  for (const url of objectUrls) URL.revokeObjectURL(url)
  objectUrls = []
}

function disposeModel(object) {
  object.traverse((node) => {
    if (node.geometry) node.geometry.dispose()
    if (node.material) {
      const materials = Array.isArray(node.material) ? node.material : [node.material]
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value?.isTexture) value.dispose()
        }
        material.dispose()
      }
    }
  })
}

function clearModel() {
  if (currentModel) {
    scene.remove(currentModel)
    disposeModel(currentModel)
    currentModel = null
  }
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
  camera.lookAt(center)
  controls.target.copy(center)
  controls.update()
  grid.position.y = box.min.y
  grid.scale.setScalar(Math.max(maxSize / 15, 1))
}

function addModel(object, message) {
  clearModel()
  currentModel = object
  scene.add(object)
  fitCamera(object)
  setWireframe(wireframe)
  setStatus(message)
}

function createManager(files) {
  const byName = new Map()
  for (const file of files) byName.set(file.name.toLowerCase(), file)
  const manager = new THREE.LoadingManager()
  manager.setURLModifier((url) => {
    const name = decodeURIComponent(url).split('/').pop().toLowerCase()
    const file = byName.get(name)
    if (!file) return url
    const objectUrl = URL.createObjectURL(file)
    objectUrls.push(objectUrl)
    return objectUrl
  })
  return manager
}

function loadOBJ(files, objFile) {
  const manager = createManager(files)
  const mtlFile = files.find((file) => extension(file) === 'mtl')
  const finish = (materials) => {
    const loader = new OBJLoader(manager)
    if (materials) { materials.preload(); loader.setMaterials(materials) }
    loader.load(URL.createObjectURL(objFile), (object) => addModel(object, `OBJ chargé : ${objFile.name}`), undefined, fail)
  }
  if (!mtlFile) return finish(null)
  const mtlLoader = new MTLLoader(manager)
  mtlLoader.load(URL.createObjectURL(mtlFile), finish, undefined, fail)
}

function loadGLTF(files, file) {
  const manager = createManager(files)
  new GLTFLoader(manager).load(URL.createObjectURL(file), (gltf) => addModel(gltf.scene, `${extension(file).toUpperCase()} chargé : ${file.name}`), undefined, fail)
}

function loadFBX(file) {
  new FBXLoader().load(URL.createObjectURL(file), (object) => addModel(object, `FBX chargé : ${file.name}`), undefined, fail)
}

function loadSTL(file) {
  new STLLoader().load(URL.createObjectURL(file), (geometry) => {
    geometry.computeVertexNormals()
    const object = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x9ad9ff, roughness: 0.65, metalness: 0.15 }))
    addModel(object, `STL chargé : ${file.name}`)
  }, undefined, fail)
}

function fail(error) {
  console.error(error)
  setStatus('Impossible de charger ce fichier. Consultez la console du navigateur.')
}

function loadFiles(fileList) {
  const files = [...fileList]
  const main = files.find((file) => ['obj', 'fbx', 'gltf', 'glb', 'stl'].includes(extension(file)))
  if (!main) return setStatus('Sélectionnez un fichier OBJ, FBX, GLB, GLTF ou STL.')
  clearModel()
  const ext = extension(main)
  if (ext === 'obj') loadOBJ(files, main)
  else if (ext === 'gltf' || ext === 'glb') loadGLTF(files, main)
  else if (ext === 'fbx') loadFBX(main)
  else loadSTL(main)
}

function setWireframe(enabled) {
  wireframe = enabled
  wireframeButton.textContent = enabled ? 'Matériaux' : 'Fil de fer'
  currentModel?.traverse((node) => {
    if (!node.material) return
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach((material) => { material.wireframe = enabled })
  })
}

fileInput.addEventListener('change', (event) => loadFiles(event.target.files))
resetButton.addEventListener('click', () => currentModel && fitCamera(currentModel))
wireframeButton.addEventListener('click', () => setWireframe(!wireframe))

for (const eventName of ['dragenter', 'dragover']) {
  document.body.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.add('visible') })
}
for (const eventName of ['dragleave', 'drop']) {
  document.body.addEventListener(eventName, (event) => { event.preventDefault(); dropZone.classList.remove('visible') })
}
document.body.addEventListener('drop', (event) => loadFiles(event.dataTransfer.files))

function resize() {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  renderer.setSize(width, height, false)
  camera.aspect = width / Math.max(height, 1)
  camera.updateProjectionMatrix()
}
window.addEventListener('resize', resize)
resize()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

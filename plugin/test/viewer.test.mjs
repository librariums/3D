import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('viewer contains the required browser entry points', async () => {
  const html = await readFile(new URL('../viewer/index.html', import.meta.url), 'utf8')
  const app = await readFile(new URL('../viewer/app.js', import.meta.url), 'utf8')
  assert.match(html, /type="importmap"/)
  assert.match(html, /three\/addons\//)
  assert.match(html, /app\.js/)
  for (const loader of ['OBJLoader', 'MTLLoader', 'FBXLoader', 'GLTFLoader', 'STLLoader']) {
    assert.match(app, new RegExp(`import \\{ ${loader} \\}`))
  }
})

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { name, apply } from '../index.js'

test('exports the expected DSH plugin name', () => assert.equal(name, 'dsh-3d-asset-viewer'))

test('registers and loads the bundled skill', async () => {
  let factory
  apply({ skills: { registerProvider: (create) => { factory = create } } })
  const provider = factory()
  const [summary] = await provider.list()
  assert.equal(provider.name, name)
  assert.equal(summary.rank, 600)
  assert.equal(summary.source, 'bundled')
  assert.match(summary.path, /skills[\\/]dsh-3d-asset-viewer[\\/]SKILL\.md$/)
  const skill = await provider.get({ locator: name })
  assert.match(skill.content, /^# DSH 3D asset viewer/m)
  await assert.rejects(provider.get({ locator: '../package' }), /unknown skill locator/)
})

test('publishes a complete package payload', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url)))
  assert.deepEqual(packageJson.files, ['index.js', 'cordis.patch.yml', 'skills', 'viewer', 'README.md'])
  assert.equal(packageJson.dsh.bundle.patch, './cordis.patch.yml')
  const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
  assert.match(patch, /name:\s*['"]dsh-3d-asset-viewer['"]|name:\s*['"]dsh-3d-asset-viewer['"]/) 
})

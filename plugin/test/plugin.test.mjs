import assert from 'node:assert/strict'
import test from 'node:test'
import { name, apply } from '../index.js'

test('exports the expected DSH plugin name', () => {
  assert.equal(name, 'dsh-3d-asset-viewer')
})

test('registers a provider that lists and loads the bundled skill', async () => {
  let factory
  const ctx = { skills: { registerProvider: (create) => { factory = create } } }
  apply(ctx)
  assert.equal(typeof factory, 'function')

  const provider = factory()
  assert.equal(provider.name, 'dsh-3d-asset-viewer')

  const [summary] = await provider.list()
  assert.equal(summary.name, 'dsh-3d-asset-viewer')
  assert.match(summary.description, /OBJ/)
  assert.equal(summary.rank, 600)
  assert.equal(summary.source, 'bundled')
  assert.match(summary.path, /skills[\\/]dsh-3d-asset-viewer[\\/]SKILL\.md$/)

  const skill = await provider.get({ locator: 'dsh-3d-asset-viewer' })
  assert.equal(skill.name, 'dsh-3d-asset-viewer')
  assert.match(skill.content, /^# DSH 3D asset viewer/m)
})

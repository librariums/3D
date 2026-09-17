import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const PROVIDER_NAME = 'dsh-3d-asset-viewer'
const BUNDLED_SKILL_RANK = 600
const INVOCATION = { modelInvocable: true, userInvocable: true }
const SKILL_NAMES = ['dsh-3d-asset-viewer']

function skillDirUrl(skillName) {
  return new URL(`./skills/${skillName}/`, import.meta.url)
}

function parseSkillFile(skillName, raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
  if (!match) throw new Error(`skill "${skillName}": SKILL.md has no frontmatter block`)
  const fields = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator > 0) fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim()
  }
  if (fields.name !== skillName) throw new Error(`skill "${skillName}": frontmatter name mismatch`)
  if (!fields.description) throw new Error(`skill "${skillName}": description is missing`)
  return { description: fields.description, content: raw.slice(match[0].length) }
}

async function loadSkill(skillName) {
  const raw = await readFile(new URL('SKILL.md', skillDirUrl(skillName)), 'utf8')
  return parseSkillFile(skillName, raw)
}

function shape(skillName, description) {
  return {
    name: skillName,
    description,
    invocation: INVOCATION,
    provider: PROVIDER_NAME,
    source: 'bundled',
    resourceBase: { kind: 'directory', path: fileURLToPath(skillDirUrl(skillName)) },
    path: fileURLToPath(new URL('SKILL.md', skillDirUrl(skillName))),
  }
}

const provider = {
  name: PROVIDER_NAME,
  list: () => Promise.all(SKILL_NAMES.map(async (skillName) => {
    const { description } = await loadSkill(skillName)
    return { ...shape(skillName, description), rank: BUNDLED_SKILL_RANK, locator: skillName }
  })),
  async get(candidate) {
    const skillName = candidate?.locator
    if (!SKILL_NAMES.includes(skillName)) throw new Error(`unknown skill locator: ${skillName}`)
    const { description, content } = await loadSkill(skillName)
    return { ...shape(skillName, description), content }
  },
}

export const name = PROVIDER_NAME
export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}

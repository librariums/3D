/**
 * dsh-3d-asset-viewer
 * Registers the 3D asset viewer skill for DeepSeek Harness.
 */

const PROVIDER_NAME = 'dsh-3d-asset-viewer'
const BUNDLED_SKILL_RANK = 600
const INVOCATION = { modelInvocable: true, userInvocable: true }

const skillContent = `# dsh-3d-asset-viewer

Open the local 3D asset viewer for inspecting assets in the workspace.

Supported formats:
- OBJ and MTL, including associated textures
- FBX
- GLB and GLTF, including external resources
- STL

Instructions:
- open the viewer page in the DSH web/sidebar context
- ask the user to select or drag the local asset files into the viewer
- for OBJ materials, select the OBJ, MTL and texture files together
- recommend GLB when the user wants one portable file
- if a format is unsupported, recommend converting it to GLB
- never paste binary asset contents into chat
`

export const name = 'dsh-3d-asset-viewer'
export const inject = ['skills']

export function apply(ctx) {
  const provider = {
    name: PROVIDER_NAME,
    list: async () => [{
      name: PROVIDER_NAME,
      description: 'Open a local 3D asset viewer for OBJ, MTL, FBX, GLB, GLTF and STL files',
      invocation: INVOCATION,
      provider: PROVIDER_NAME,
      source: 'bundled',
      rank: BUNDLED_SKILL_RANK,
      locator: PROVIDER_NAME,
    }],
    async get() {
      return {
        name: PROVIDER_NAME,
        description: 'Open a local 3D asset viewer for OBJ, MTL, FBX, GLB, GLTF and STL files',
        invocation: INVOCATION,
        provider: PROVIDER_NAME,
        source: 'bundled',
        content: skillContent,
      }
    },
  }

  ctx.skills.registerProvider(() => provider)
}

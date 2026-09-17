---
name: dsh-3d-asset-viewer
description: Open and inspect local OBJ, MTL, FBX, GLB, GLTF and STL files with the bundled 3D viewer.
---

# 3D Asset Viewer

Use this skill when the user wants to inspect a local 3D asset.

## Viewer URL

The bundled viewer is a local web application. Start it from the repository root with:

```bash
python3 -m http.server 8080 --directory plugin/viewer
```

Open `http://127.0.0.1:8080` in a browser or in a DSH web panel that allows local HTTP pages.

## Supported assets

- `.glb`: recommended; usually contains geometry, materials and textures in one file.
- `.gltf`: select the `.gltf`, `.bin` and referenced texture files together.
- `.obj`: select the `.obj`, `.mtl` and referenced texture files together.
- `.fbx`: select the FBX file.
- `.stl`: select the STL file; it is displayed with a neutral material.

The viewer reads files in the browser. It does not upload them to a remote service.

## Important behavior

Installing this skill makes it available to DSH. It does not automatically create an iframe or HTTP route inside the DSH sidebar. If the DSH host does not permit local pages, open the viewer in a separate browser tab.

Do not paste binary model data into chat. For unsupported formats such as USDZ, PLY, 3MF, DAE or X3D, convert the asset to GLB first.

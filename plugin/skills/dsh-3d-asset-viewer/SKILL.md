---
name: dsh-3d-asset-viewer
description: Open and inspect local OBJ, MTL, FBX, GLB, GLTF and STL assets with the bundled web viewer.
---

# DSH 3D asset viewer

This skill provides the bundled browser viewer at `viewer/index.html` inside the installed plugin.

## Important integration note

The DSH skill registry loads skills; it does not automatically mount an arbitrary HTML file in the sidebar. To use the viewer, serve `plugin/viewer/` over HTTP and open that URL in the DSH web/sidebar environment supported by the installed DSH version.

For a standalone preview:

```bash
python3 -m http.server 8080 --directory <installed-plugin>/viewer
```

Then open `http://localhost:8080`.

Supported formats:

- OBJ, with optional MTL and texture files selected together
- FBX
- GLB / GLTF, including external resources when selected together
- STL

Prefer GLB when one portable file is needed. Never paste binary model data into chat. If the viewer cannot be mounted by the current DSH web host, explain that limitation and provide the local viewer URL instead of claiming that it opened automatically.

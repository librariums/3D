# dsh-3d-asset-viewer

Bundle DSH 0.1.3 contenant la skill `dsh-3d-asset-viewer` et un viewer web local.

## Installation

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

## Viewer

```bash
python3 -m http.server 8080 --directory /chemin/vers/3D/plugin/viewer
```

Ouvrez `http://127.0.0.1:8080`. Le viewer prend en charge GLB, GLTF, OBJ/MTL, FBX et STL.

## Tests

```bash
npm test
```

Le viewer est une application web locale distincte du registre de skills DSH. L’ouverture dans une sidebar dépend des capacités de l’hôte web DSH.

# dsh-3d-asset-viewer

Bundle DSH contenant la skill `dsh-3d-asset-viewer` et le viewer web autonome.

## Installation exacte

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

## Test du bundle

```bash
cd plugin
npm test
```

## Viewer

Le viewer doit être servi séparément :

```bash
python3 -m http.server 8080 --directory /chemin/vers/plugin/viewer
```

Puis ouvrir `http://127.0.0.1:8080`.

Le viewer supporte OBJ/MTL, FBX, GLB/GLTF et STL. GLB est recommandé. Le viewer ne prétend pas créer automatiquement une iframe dans la sidebar : cette partie dépend de l'hôte web DSH.

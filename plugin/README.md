# dsh-3d-asset-viewer

Bundle DSH contenant la skill `dsh-3d-asset-viewer` et le viewer web autonome.

Installation :

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

Le viewer doit être servi séparément :

```bash
python3 -m http.server 8080 --directory /chemin/vers/plugin/viewer
```

Consultez le [README racine](../README.md) pour le test du package et les limites d'intégration dans la sidebar.

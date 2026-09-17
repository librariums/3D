# dsh-3d-asset-viewer

This is a DeepSeek Harness packaged skill provider. It registers the `dsh-3d-asset-viewer` skill and includes a standalone browser viewer in `viewer/`.

## Install from this repository

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

The plugin is loaded through `cordis.patch.yml` and the skill is read from `skills/dsh-3d-asset-viewer/SKILL.md`.

## Open the actual viewer

The DSH skill registry does not itself serve arbitrary HTML. Run a local HTTP server for the installed plugin's `viewer/` directory:

```bash
python3 -m http.server 8080 --directory /path/to/installed/plugin/viewer
```

Open `http://localhost:8080` in the DSH web/sidebar host, if that host permits local web pages. See the repository README for the complete workflow.

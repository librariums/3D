# 3D Asset Library & DSH Viewer

Lecteur web local d'assets 3D et bundle de skill pour DeepSeek Harness `0.1.2-rc.1`.

## Installation

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

Le plugin est volontairement séparé en deux parties : le provider DSH/skill et le viewer web. Installer le plugin rend la skill disponible ; cela ne crée pas automatiquement une route HTTP ni une iframe dans la sidebar.

## Viewer local

```bash
python3 -m http.server 8080 --directory /chemin/vers/3D/plugin/viewer
```

Ouvre ensuite `http://localhost:8080`.

## Développement et vérification

```bash
cd plugin
npm test
```

Le test vérifie le provider et le chargement de `SKILL.md`. Pour vérifier l'interface :

1. lance le serveur HTTP ;
2. ouvre `http://localhost:8080` ;
3. charge un GLB de test ;
4. vérifie la rotation, le zoom, le bouton de vue et le mode fil de fer ;
5. teste OBJ + MTL + texture puis FBX et STL.

## Formats

OBJ/MTL, FBX, GLB, GLTF et STL. GLB est le format recommandé. USDZ n'est pas supporté dans cette version.

## Architecture DSH

```text
plugin/
  package.json                 # manifeste et dsh.bundle.patch
  cordis.patch.yml             # insertion du bundle dans le profil
  index.js                     # provider ctx.skills
  skills/.../SKILL.md          # skill avec frontmatter
  viewer/                      # ressource web autonome
  test/                        # smoke test Node du contrat local
```

Le modèle de bundle est basé sur les ressources officielles de DeepSeek Harness : [bundles](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle), [skills](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md) et [tutoriel Cordis](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/cordis-tutorial).

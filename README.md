# 3D Asset Library & DSH viewer

Plugin bundle DSH et viewer web local pour DeepSeek Harness `0.1.2-rc.1`.

## Ce qui est réellement fourni

Le package fournit deux capacités séparées :

1. un provider `ctx.skills` découvert par DSH ;
2. un viewer HTML autonome dans `plugin/viewer/`.

Le registre des skills ne sert pas automatiquement un fichier HTML et ne crée pas une iframe dans la sidebar. Le viewer doit être servi par HTTP, puis ouvert dans le navigateur ou dans un panneau web autorisé par votre configuration DSH.

## Installation DSH

Depuis un environnement qui contient `dsh` :

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

Redémarrez `dsh web` après l'installation ou une mise à jour.

## Test local du bundle

```bash
git clone https://github.com/librariums/3D.git
cd 3D/plugin
npm test
```

Ce test vérifie le provider, le frontmatter de la skill, le locator, le patch Cordis et le payload publié. Il ne remplace pas un test dans le runtime DSH réel.

## Lancer le viewer

Depuis la racine du dépôt :

```bash
python3 -m http.server 8080 --directory "$PWD/plugin/viewer"
```

Ouvrez ensuite `http://127.0.0.1:8080`.

Avec Node.js :

```bash
npx --yes serve plugin/viewer
```

N'ouvrez pas `index.html` avec `file://` : les modules ES et les ressources relatives doivent être servis par HTTP.

## Utilisation

- GLB : format recommandé, généralement autonome ;
- GLTF : sélectionnez aussi les fichiers `.bin` et textures ;
- OBJ : sélectionnez l'OBJ, le MTL et les textures ensemble ;
- FBX : import direct ;
- STL : affichage avec matériau neutre.

Formats non inclus dans cette RC : USDZ, PLY, 3MF, DAE et X3D. Convertissez-les en GLB.

## Dépannage

- **Skill absente** : vérifiez l'installation dans le profil `web`, puis redémarrez DSH.
- **Viewer vide** : vérifiez la console du navigateur et utilisez HTTP, pas `file://`.
- **Textures absentes** : sélectionnez tous les fichiers associés et vérifiez les noms référencés par le MTL/GLTF.
- **Sidebar impossible** : l'hôte web DSH doit autoriser l'ouverture de `http://127.0.0.1:8080`; sinon utilisez une fenêtre de navigateur séparée.

## Références DSH

- [Bundles DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle)
- [Skill subsystem](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md)
- [Cordis tutorial](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/cordis-tutorial)

## Licence

MIT

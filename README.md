# 3D Asset Library & DSH viewer

Plugin bundle DSH et viewer web local pour DeepSeek Harness `0.1.2-rc.1`.

## État de compatibilité

Cette version fournit un **bundle de skill DSH** et un **viewer web autonome**. Le registre des skills ne sert pas automatiquement un fichier HTML et ne crée pas d'iframe dans la sidebar. Le viewer doit être servi par HTTP, puis ouvert dans le navigateur ou dans un panneau web autorisé par la configuration DSH.

## Installation DSH

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

Redémarrez `dsh web` après l'installation ou une mise à jour.

## Validation locale obligatoire

```bash
git clone https://github.com/librariums/3D.git
cd 3D/plugin
npm test
```

Le smoke test vérifie le nom du plugin, le provider `ctx.skills`, le frontmatter et le locator de la skill, le patch Cordis, le payload npm et les loaders du viewer. Il ne remplace pas un test dans un runtime DSH installé.

## Lancer le viewer

Depuis la racine du dépôt :

```bash
python3 -m http.server 8080 --directory "$PWD/plugin/viewer"
```

Ouvrez `http://127.0.0.1:8080`. Ne lancez pas `index.html` avec `file://`.

## Formats

- GLB : recommandé, généralement autonome ;
- GLTF : sélectionnez aussi les fichiers `.bin` et textures ;
- OBJ : sélectionnez l'OBJ, le MTL et les textures ensemble ;
- FBX : import direct ;
- STL : matériau neutre.

USDZ, PLY, 3MF, DAE et X3D ne sont pas inclus dans cette RC : convertissez-les en GLB.

## Checklist de validation

- [ ] `npm test` passe dans `plugin/`.
- [ ] `dsh plugin --profile web add ...` termine sans erreur.
- [ ] `dsh web` redémarre avec le plugin installé.
- [ ] la skill `dsh-3d-asset-viewer` apparaît dans le catalogue DSH.
- [ ] le viewer s'ouvre sur `http://127.0.0.1:8080`.
- [ ] un GLB se charge et la caméra, rotation, zoom, reset et fil de fer fonctionnent.
- [ ] OBJ + MTL + texture se charge avec ses matériaux.
- [ ] GLTF + BIN + texture se charge.
- [ ] FBX et STL se chargent.
- [ ] un second chargement libère le premier modèle sans erreur.
- [ ] l'hôte DSH autorise ou refuse explicitement l'ouverture de la page locale ; si elle est refusée, utiliser un navigateur séparé.

## Références

- [Bundles DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/bundle)
- [Skill subsystem](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/subsystems/skills.md)
- [Cordis tutorial](https://github.com/deepseek-ai/deepseek-harness/tree/master/docs/cordis-tutorial)

## Licence

MIT

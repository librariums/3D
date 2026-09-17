# dsh-3d-asset-viewer

Plugin bundle compatible avec le modèle de skills de DeepSeek Harness `0.1.2-rc.1`.

## Installation depuis GitHub

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

Le plugin est un **bundle Cordis** :

- `package.json` déclare `dsh.bundle.patch` ;
- `cordis.patch.yml` insère le package dans le profil ;
- `index.js` enregistre un provider dans `ctx.skills` ;
- `skills/dsh-3d-asset-viewer/SKILL.md` contient le frontmatter et le corps de la skill.

Redémarre `dsh web` après l'installation ou après une mise à jour du plugin.

## Ouvrir le viewer

La skill DSH n'est pas un serveur HTTP et le registre des skills ne monte pas automatiquement une page HTML dans la sidebar. Le viewer est donc distribué comme ressource du plugin et doit être servi par un serveur local :

```bash
python3 -m http.server 8080 --directory /chemin/vers/le/plugin/viewer
```

Puis ouvre `http://localhost:8080` dans ton navigateur ou dans le panneau web de DSH si ta version de DSH autorise les pages locales.

Pour une installation locale depuis ce dépôt :

```bash
git clone https://github.com/librariums/3D.git
cd 3D
dsh plugin --profile web add "file:$(pwd)/plugin"
python3 -m http.server 8080 --directory "$(pwd)/plugin/viewer"
dsh web
```

## Formats

- **OBJ** : sélectionner l'OBJ, le MTL et les textures ensemble ;
- **GLB/GLTF** : sélectionner aussi les fichiers binaires et textures externes pour GLTF ;
- **FBX** : import direct ;
- **STL** : affichage avec matériau neutre.

GLB est recommandé pour un asset portable avec matériaux et textures intégrés.

## Tests du bundle

Depuis le dossier `plugin/` :

```bash
npm test
```

Le test vérifie le contrat local du provider : nom, résumé, rang, chemins de ressource et chargement de `SKILL.md`. Il ne remplace pas un test dans un runtime DSH installé.

## Limites connues

- Le viewer nécessite un serveur HTTP et une connexion aux modules Three.js chargés depuis `unpkg.com`.
- USDZ n'est pas pris en charge ; convertis-le en GLB.
- L'ouverture automatique dans une sidebar dépend de l'hôte web et de la version exacte de DSH ; la skill ne prétend pas ouvrir une page si l'hôte ne fournit pas cette capacité.

## Licence

MIT

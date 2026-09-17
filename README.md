# 3D Asset Viewer pour DeepSeek Harness

Un plugin DSH simple et utilisable pour prévisualiser localement des assets 3D dans le navigateur.

## Ce que fait le plugin

Le projet contient :

- une skill DSH nommée `dsh-3d-asset-viewer` ;
- un bundle Cordis installable avec `dsh plugin` ;
- un viewer web local basé sur Three.js ;
- une interface avec sélection de fichiers, glisser-déposer, rotation, zoom, déplacement, réinitialisation et mode fil de fer.

Les fichiers restent dans le navigateur : le viewer ne les envoie pas vers un serveur distant.

## Formats pris en charge

| Format | Utilisation |
| --- | --- |
| GLB | Format recommandé : modèle et textures généralement regroupés |
| GLTF | Sélectionner aussi les fichiers `.bin` et textures |
| OBJ | Sélectionner l’OBJ, le MTL et les textures |
| FBX | Sélectionner le fichier FBX |
| STL | Affiché avec un matériau neutre |

Les formats USDZ, PLY, 3MF, DAE et X3D ne sont pas pris en charge dans cette version. Convertissez-les en GLB.

## Installation dans DSH

Pré-requis : DSH `0.1.2-rc.1` ou version compatible et Node.js 20 ou plus récent.

Depuis l’environnement où la commande `dsh` est disponible :

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

Après une mise à jour du plugin, redémarrez `dsh web` pour recharger le bundle.

Le plugin est composé de quatre éléments :

- `plugin/package.json` déclare le bundle ;
- `plugin/cordis.patch.yml` l’insère dans le profil ;
- `plugin/index.js` enregistre le provider de skills ;
- `plugin/skills/.../SKILL.md` contient les instructions de la skill.

## Ouvrir le viewer

Le viewer doit être servi par HTTP. Ne double-cliquez pas sur `index.html` et n’utilisez pas `file://`.

Depuis la racine du dépôt :

```bash
python3 -m http.server 8080 --directory "$PWD/plugin/viewer"
```

Ouvrez ensuite :

```text
http://127.0.0.1:8080
```

Alternative avec Node.js :

```bash
npx --yes serve plugin/viewer
```

L’installation de la skill et l’ouverture du viewer sont deux étapes distinctes : DSH découvre la skill, tandis que le serveur HTTP sert l’interface 3D.

## Utilisation

1. Lancez le serveur HTTP.
2. Ouvrez `http://127.0.0.1:8080`.
3. Cliquez sur **Choisir des fichiers** ou déposez les fichiers dans la fenêtre.
4. Pour un OBJ, sélectionnez ensemble OBJ, MTL et textures.
5. Pour un GLTF, sélectionnez GLTF, BIN et textures.
6. Utilisez la souris pour tourner, zoomer et déplacer la caméra.
7. Utilisez **Réinitialiser** pour recadrer le modèle.
8. Utilisez **Fil de fer** pour inspecter la géométrie.

## Vérifier l’installation du plugin

```bash
cd plugin
npm test
```

Les tests vérifient le nom du plugin, la découverte de la skill, son frontmatter, le locator, le patch Cordis, le contenu publié et les loaders du viewer.

## Dépannage

### La skill n’apparaît pas

Vérifiez que le plugin a été installé dans le profil utilisé par `dsh web`, puis redémarrez DSH :

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

### Le viewer affiche une page vide

Utilisez `http://127.0.0.1:8080`, pas `file://`. Vérifiez également la console du navigateur et votre connexion Internet : Three.js est chargé depuis `unpkg.com`.

### Les textures ne s’affichent pas

Sélectionnez tous les fichiers associés en même temps. Les noms de fichiers doivent correspondre aux références dans le MTL ou le GLTF. GLB est recommandé lorsque vous voulez éviter ces dépendances.

### Le viewer ne s’affiche pas dans la sidebar

Le registre DSH ne monte pas automatiquement une page HTML arbitraire dans la sidebar. Ouvrez l’URL locale dans un onglet séparé si l’hôte web DSH bloque les pages locales.

## Développement

```bash
git clone https://github.com/librariums/3D.git
cd 3D/plugin
npm test
```

Pour modifier le viewer, servez `plugin/viewer/` avec le serveur Python et rechargez la page dans le navigateur.

## Licence

MIT

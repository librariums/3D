# 3D Asset Library & DSH Viewer

Plugin et viewer 3D pour DeepSeek Harness (DSH), avec prise en charge des formats OBJ, MTL, FBX, GLB, GLTF et STL.

Le dossier `plugin/` contient le plugin DSH. Le dossier `plugin/viewer/` contient le viewer web à afficher dans la sidebar ou à ouvrir localement.

## Fonctionnalités

- Import par bouton ou glisser-déposer
- OBJ avec MTL et textures associées
- FBX
- GLB / GLTF avec textures externes
- STL
- Orbit controls : rotation, zoom et déplacement
- Ajustement automatique de la caméra
- Grille, éclairage et réinitialisation de la vue
- Aucun upload vers un serveur : les fichiers sont lus localement dans le navigateur

## Installation du plugin DSH

### Depuis GitHub

Depuis le dossier du projet DeepSeek Harness :

```bash
dsh plugin --profile web add "github:librariums/3D#path:/plugin"
dsh web
```

Si votre installation de DSH utilise un profil différent, remplacez `web` par le nom de votre profil.

### Installation locale pour le développement

Clonez le dépôt puis installez le dossier `plugin` :

```bash
git clone https://github.com/librariums/3D.git
cd 3D
dsh plugin --profile web add "file:$(pwd)/plugin"
dsh web
```

Après une modification du code, redémarrez le serveur DSH afin de recharger le plugin.

## Lancer le viewer seul

Le viewer utilise des modules JavaScript ES et doit être servi par un serveur HTTP local. N'ouvrez pas directement `index.html` avec `file://`.

Avec Python :

```bash
cd plugin/viewer
python3 -m http.server 8080
```

Puis ouvrez :

```text
http://localhost:8080
```

Avec Node.js :

```bash
npx serve plugin/viewer
```

## Utilisation dans la sidebar DSH

1. Installez le plugin avec la commande ci-dessus.
2. Lancez `dsh web`.
3. Demandez à DSH d'ouvrir le viewer 3D ou ouvrez la page `plugin/viewer/index.html` dans le panneau web prévu par votre configuration DSH.
4. Cliquez sur **Choisir un asset 3D** ou glissez-déposez un fichier dans le viewer.
5. Pour un OBJ avec matériaux, sélectionnez simultanément le `.obj`, le `.mtl` et les textures associées.

Le plugin enregistre la skill `dsh-3d-asset-viewer`, qui décrit au modèle comment utiliser le viewer. La manière exacte d'ouvrir une page web dans une sidebar peut dépendre de la version de DeepSeek Harness utilisée.

## Formats supportés

| Format | Support | Remarques |
| --- | --- | --- |
| OBJ | Oui | Sélectionnez aussi le MTL et les textures pour les matériaux |
| MTL | Oui | Utilisé avec un OBJ |
| FBX | Oui | Les fichiers complexes peuvent être lourds dans le navigateur |
| GLB | Oui | Format recommandé pour partager un asset complet |
| GLTF | Oui | Sélectionnez aussi les fichiers binaires et textures externes |
| STL | Oui | Affiché avec un matériau neutre |
| USDZ | Non | Convertir en GLB avant import |

## Format recommandé

Pour obtenir le meilleur résultat, utilisez **GLB** : la géométrie, les matériaux et les textures sont généralement regroupés dans un seul fichier.

## Dépannage

### Le viewer reste vide

- Lancez-le avec un serveur HTTP, pas avec `file://`.
- Vérifiez la console du navigateur.
- Essayez un fichier GLB simple.

### Les textures OBJ ne s'affichent pas

- Sélectionnez le `.obj`, le `.mtl` et les images de texture ensemble.
- Vérifiez que les noms référencés dans le MTL correspondent aux noms des fichiers.
- Évitez les chemins absolus dans le fichier MTL.

### Le modèle est trop grand ou invisible

Cliquez sur **Réinitialiser la vue**. Le viewer calcule automatiquement une position de caméra adaptée aux dimensions du modèle.

## Développement

Le plugin ne contient pas de dépendance npm obligatoire. Le viewer charge Three.js et ses loaders depuis `jsDelivr`. Une connexion réseau est donc nécessaire lors du chargement du viewer, sauf si vous remplacez ces imports par une copie locale de Three.js.

## Licence

MIT

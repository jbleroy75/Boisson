# Guide Prompts Midjourney - Tamarque

## Structure des fichiers

```
prompts/
├── 00-README.md          # Ce fichier
├── 01-PRODUITS.md        # 6 prompts (5 saveurs + pack)
├── 02-LOGO.md            # 5 prompts (logos + icônes)
├── 03-HERO.md            # 8 prompts (images héros)
├── 04-LIFESTYLE.md       # 8 prompts (lifestyle/fitness)
├── 05-BLOG-NUTRITION.md  # 7 prompts (recettes/nutrition)
└── 06-SOCIAL-OG.md       # 7 prompts (réseaux sociaux)
```

**Total: 41 prompts**

---

## Comment utiliser

### 1. Ouvrir Midjourney
- Va sur [midjourney.com](https://midjourney.com) ou Discord

### 2. Copier le prompt
- Ouvre le fichier correspondant
- Copie le texte dans le bloc \`\`\`

### 3. Générer
- Colle dans Midjourney
- Attends la génération
- Choisis la meilleure variation (U1, U2, U3, U4)

### 4. Upscale & Download
- Upscale la version choisie
- Télécharge en haute résolution

### 5. Renommer et placer
- Renomme selon le nom de fichier indiqué
- Place dans le bon dossier `/public/images/...`

---

## Paramètres Midjourney

| Paramètre | Signification |
|-----------|---------------|
| `--ar 3:4` | Ratio vertical (produits) |
| `--ar 16:9` | Ratio horizontal (hero) |
| `--ar 1:1` | Ratio carré (logo, social) |
| `--ar 4:5` | Ratio Instagram portrait |
| `--ar 9:16` | Ratio Story vertical |
| `--v 6.1` | Version Midjourney 6.1 |
| `--style raw` | Style moins stylisé, plus réaliste |
| `--q 2` | Qualité maximum (optionnel) |

---

## Ordre recommandé

1. **Logo** (02-LOGO.md) - Pour avoir la marque d'abord
2. **Produits** (01-PRODUITS.md) - Images principales
3. **Hero** (03-HERO.md) - Pour la homepage
4. **OG Image** (06-SOCIAL-OG.md) - Pour le SEO
5. **Lifestyle** (04-LIFESTYLE.md) - Pour le blog/social
6. **Nutrition** (05-BLOG-NUTRITION.md) - Contenu blog

---

## Destination des fichiers

```
public/
├── images/
│   ├── products/
│   │   ├── yuzu-peach.png
│   │   ├── hibiscus-raspberry.png
│   │   ├── matcha-vanilla.png
│   │   ├── coco-pineapple.png
│   │   ├── dragon-fruit.png
│   │   └── all-flavors.png
│   ├── logo/
│   │   ├── logo-full.png
│   │   ├── logo-full-dark.png
│   │   ├── icon-512.png
│   │   ├── icon-192.png
│   │   └── apple-touch-icon.png
│   ├── hero/
│   │   ├── hero-home.jpg
│   │   ├── hero-shop.jpg
│   │   ├── hero-subscribe.jpg
│   │   └── ...
│   └── blog/
│       ├── lifestyle-crossfit.jpg
│       ├── recipe-smoothie-bowl.jpg
│       └── ...
├── og-image.jpg
└── manifest.json
```

---

## Tips Midjourney

1. **Variations** : Si le résultat n'est pas parfait, utilise 🔄 pour régénérer
2. **Remix** : Active le mode Remix pour modifier légèrement un prompt
3. **Seed** : Note le seed d'une bonne image pour la reproduire
4. **Upscale** : Toujours upscale avant de télécharger
5. **Batch** : Génère plusieurs images en parallèle pour gagner du temps

---

## Couleurs de référence

- Orange (Energie) : `#FF6B35`
- Vert (Nature) : `#00D9A5`
- Rose (Dragon Fruit) : `#FF1493`
- Noir : `#1A1A1A`
- Or : `#FFD700`

---

## Support

Une fois les images générées, place-les dans les bons dossiers et le site les utilisera automatiquement !

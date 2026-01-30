# Templates Email Shopify - Tamarque

Templates email personnalisés pour Shopify avec le branding Tamarque.

## Installation

### 1. Accéder aux notifications Shopify

1. Connectez-vous à votre **Shopify Admin**
2. Allez dans **Settings** (Paramètres) > **Notifications**
3. Cliquez sur le template à modifier

### 2. Remplacer le template

Pour chaque notification :

1. Cliquez sur **"Edit code"** (Modifier le code)
2. Sélectionnez tout le contenu (Cmd+A / Ctrl+A)
3. Collez le contenu du fichier `.liquid` correspondant
4. Cliquez sur **"Save"** (Enregistrer)
5. Cliquez sur **"Preview"** pour vérifier le rendu

## Templates disponibles

| Fichier | Notification Shopify | Description |
|---------|---------------------|-------------|
| `order-confirmation.liquid` | Order confirmation | Confirmation de commande |
| `shipping-confirmation.liquid` | Shipping confirmation | Expédition envoyée |
| `customer-account-welcome.liquid` | Customer account welcome | Bienvenue nouveau client |
| `abandoned-cart.liquid` | Abandoned checkout | Panier abandonné |
| `customer-password-reset.liquid` | Customer account password reset | Réinitialisation mot de passe |
| `order-refund.liquid` | Order refund | Confirmation de remboursement |

## Caractéristiques

### Design
- **Gradient orange/rose** (#FF6B35 → #FF1493) pour les headers positifs
- **Gradient vert** (#00D9A5 → #00B589) pour les confirmations d'expédition/remboursement
- **Gradient noir** (#1A1A1A → #333333) pour les emails transactionnels (panier abandonné, reset password)
- **Border-radius** 16px pour un look moderne
- **Emojis** pour un ton friendly et lifestyle

### Responsive
- Max-width 600px
- Tables pour compatibilité Outlook
- Inline CSS pour compatibilité maximum

### Accessibilité
- Contraste suffisant pour la lisibilité
- Alt text sur les images
- Structure sémantique

## Personnalisation

### Modifier les couleurs
Recherchez et remplacez dans les templates :
- `#FF6B35` - Orange principal
- `#FF1493` - Rose accent
- `#00D9A5` - Vert succès
- `#1A1A1A` - Noir footer

### Modifier les liens sociaux
Recherchez `instagram.com/tamarque` et `tiktok.com/@tamarque` et remplacez par vos vraies URLs.

### Modifier le logo
Actuellement en texte (`TAMARQUE`). Pour utiliser une image :

```html
<img src="https://cdn.shopify.com/s/files/1/xxxx/logo.png" alt="Tamarque" width="150">
```

Uploadez d'abord le logo dans **Settings > Files** pour obtenir l'URL.

## Test

1. **Preview** : Utilisez la fonction Preview dans Shopify
2. **Test email** : Envoyez un email de test à votre adresse
3. **Litmus/Email on Acid** : Pour tester sur tous les clients email (optionnel)

## Templates non inclus

Ces templates utilisent les valeurs par défaut Shopify (suffisant) :
- Confirmation de compte
- Invitation de compte
- Notification de contact
- Facture (draft order invoice)
- Carte cadeau
- Notification POS

## Support

Pour toute question, contactez l'équipe tech Tamarque.

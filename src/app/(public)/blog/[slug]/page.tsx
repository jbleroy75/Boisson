'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getPostBySlug, getRelatedPosts } from '@/lib/sanity';
import type { BlogPost } from '@/types';

// Mock blog content (fallback when Sanity is not configured)
const MOCK_BLOG_POSTS: Record<string, {
  title: string;
  excerpt: string;
  author: { name: string };
  publishedAt: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  'pilates-reformer-guide-complet-debutant': {
    title: 'Pilates Reformer : le guide complet pour débuter',
    excerpt: 'Tout ce que tu dois savoir avant ta première séance de Pilates Reformer.',
    author: { name: 'Claire Fontaine' },
    publishedAt: '15 février 2024',
    readTime: '10 min',
    category: 'Pilates',
    content: `
Le Pilates Reformer fait fureur, et pour cause : cette machine inventée par Joseph Pilates offre un entraînement complet qui transforme le corps en profondeur. Si tu envisages de te lancer, ce guide est fait pour toi.

## Qu'est-ce que le Pilates Reformer ?

Le Reformer est une machine composée d'un chariot coulissant sur des rails, relié à des ressorts de différentes résistances. Des sangles pour les pieds et les mains, une barre pour les pieds (footbar) et des cordes complètent l'équipement.

Contrairement au Pilates au sol (mat), le Reformer offre une résistance variable qui permet de :
- Travailler en excentrique et concentrique
- Adapter l'intensité à chaque exercice
- Cibler des muscles difficiles à atteindre autrement
- Assister ou challenger les mouvements

## Les bienfaits pour les débutants

**Alignement guidé** : La machine guide naturellement le corps dans le bon alignement, ce qui réduit le risque de mauvaise posture.

**Résistance adaptable** : Tu commences avec des ressorts légers et tu augmentes progressivement. Pas de risque de te surestimer.

**Feedback immédiat** : Si tu n'es pas aligné, tu le sens tout de suite. C'est un excellent professeur.

**Travail global** : Même les exercices "simples" engagent le core et plusieurs groupes musculaires.

## Ta première séance : à quoi t'attendre

**Avant la séance**
- Porte des vêtements ajustés (pas de vêtements amples qui peuvent se coincer)
- Arrive 10 minutes en avance pour découvrir la machine
- Préviens l'instructeur si tu as des blessures ou limitations

**Pendant la séance**
- L'instructeur réglera les ressorts pour toi
- Concentre-toi sur la respiration : inspire par le nez, expire par la bouche
- La qualité prime sur la quantité : mieux vaut 5 répétitions parfaites que 15 bâclées
- N'hésite pas à demander des ajustements

**Après la séance**
- Tu vas probablement sentir des muscles dont tu ignorais l'existence
- Hydrate-toi bien – une Tamarque est parfaite pour la récup
- Les courbatures arrivent souvent 24-48h après

## Les exercices de base

**Footwork** : Allongé sur le dos, pieds sur la barre, tu pousses et reviens. C'est l'exercice d'échauffement par excellence qui travaille les jambes et active le core.

**The Hundred** : L'exercice signature du Pilates. Allongé, jambes en table ou tendues, tu pompes les bras tout en maintenant le core engagé. 100 pulsations au total.

**Leg Circles** : Pieds dans les sangles, tu dessines des cercles avec les jambes. Excellent pour la mobilité des hanches et le contrôle du bassin.

**Short Spine** : Un massage pour ta colonne vertébrale. Tu roules vertèbre par vertèbre, les pieds dans les sangles.

## Les erreurs de débutant à éviter

❌ **Retenir sa respiration** : La respiration est fondamentale en Pilates. Expire pendant l'effort.

❌ **Utiliser trop de ressorts** : Plus de résistance ≠ meilleur workout. Parfois moins de ressorts = plus de challenge pour le core.

❌ **Négliger le placement du bassin** : Neutre ou imprimé, ton bassin doit être placé consciemment.

❌ **Se comparer aux autres** : Chaque corps est différent. Concentre-toi sur ton propre progrès.

## Fréquence recommandée

Pour voir des résultats, vise 2 à 3 séances par semaine. Le Pilates est assez doux pour être pratiqué fréquemment, mais laisse au moins un jour de repos entre les séances au début.

## L'importance de la nutrition

Le Pilates travaille les muscles en profondeur. Pour optimiser ta récupération et tes progrès, assure-toi d'avoir un apport protéique suffisant. Une Tamarque après ta séance apporte 20g de protéines sous forme légère et digeste – parfait après un workout qui sollicite le ventre.

**Le mot de la fin** : Le Pilates Reformer peut sembler intimidant au début, mais c'est une discipline accessible à tous. Fais confiance au processus, sois patient avec ton corps, et tu verras des transformations remarquables.
    `,
  },
  'pilates-reformer-vs-mat-differences': {
    title: 'Pilates Reformer vs Pilates Mat : quelles différences ?',
    excerpt: 'Reformer ou tapis ? Chaque méthode a ses avantages.',
    author: { name: 'Claire Fontaine' },
    publishedAt: '12 février 2024',
    readTime: '7 min',
    category: 'Pilates',
    content: `
"Je fais du Pilates" peut signifier beaucoup de choses. Entre le mat (tapis) et le Reformer, les deux approches offrent des expériences très différentes. Décryptage pour t'aider à choisir.

## Le Pilates Mat : retour aux sources

Le Pilates sur tapis est la forme originelle créée par Joseph Pilates. Tu n'as besoin que d'un tapis et de ton corps.

**Avantages du Mat :**
- Praticable partout (maison, parc, voyage)
- Coût minimal
- Développe une conscience corporelle profonde
- Force pure du core sans assistance

**Inconvénients :**
- Moins de variété d'exercices
- Certains mouvements difficiles sans assistance
- Moins de feedback sur l'alignement
- Peut être frustrant pour les débutants

## Le Pilates Reformer : l'évolution

Le Reformer ajoute une dimension de résistance variable et de mouvement guidé.

**Avantages du Reformer :**
- Plus de 100 exercices possibles
- Résistance ajustable (plus facile OU plus difficile)
- Excellent pour la rééducation
- Feedback immédiat sur l'alignement
- Travail excentrique facilité

**Inconvénients :**
- Nécessite un studio ou un équipement coûteux
- Moins accessible pour la pratique quotidienne
- Peut créer une dépendance à la machine

## Comparaison par objectif

**Pour le renforcement du core**
- Mat : ⭐⭐⭐⭐⭐ (pas d'assistance, travail pur)
- Reformer : ⭐⭐⭐⭐ (excellent mais parfois assisté)

**Pour la souplesse**
- Mat : ⭐⭐⭐ (limité aux étirements classiques)
- Reformer : ⭐⭐⭐⭐⭐ (les sangles permettent des étirements profonds)

**Pour la rééducation/blessures**
- Mat : ⭐⭐ (difficile d'adapter)
- Reformer : ⭐⭐⭐⭐⭐ (résistance modulable, positions variées)

**Pour les débutants**
- Mat : ⭐⭐⭐ (peut être frustrant)
- Reformer : ⭐⭐⭐⭐⭐ (la machine guide le mouvement)

**Pour les sportifs confirmés**
- Mat : ⭐⭐⭐⭐ (challenge le core sans assistance)
- Reformer : ⭐⭐⭐⭐⭐ (infinité de progressions)

## Mon verdict

L'idéal ? Combiner les deux. Le Mat développe une force fonctionnelle et une conscience corporelle que le Reformer seul ne peut pas apporter. Mais le Reformer permet des progressions et une variété impossibles au sol.

**Ma recommandation :**
- Débute par quelques séances de Reformer pour apprendre les principes
- Intègre une pratique Mat à la maison entre les séances
- Alterne les deux pour des résultats optimaux

## Et la nutrition dans tout ça ?

Que tu fasses du Mat ou du Reformer, ton corps a besoin de protéines pour récupérer et se renforcer. La différence avec d'autres sports ? Le Pilates travaille en profondeur des muscles stabilisateurs souvent négligés. Une nutrition adaptée – avec suffisamment de protéines de qualité comme celles de Tamarque – optimise cette reconstruction musculaire.
    `,
  },
  'pilates-reformer-bienfaits-corps': {
    title: '10 bienfaits du Pilates Reformer sur ton corps',
    excerpt: 'Posture, souplesse, renforcement profond, récupération...',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '10 février 2024',
    readTime: '8 min',
    category: 'Pilates',
    content: `
Le Pilates Reformer n'est pas qu'une tendance fitness. C'est une méthode de travail corporel dont les bienfaits sont soutenus par la science. Voici 10 transformations que tu peux attendre d'une pratique régulière.

## 1. Posture transformée

Le Reformer renforce les muscles posturaux profonds – ceux qui maintiennent ta colonne vertébrale alignée. Après quelques semaines, tu te tiens naturellement plus droit, sans effort conscient.

**La science** : Une étude de 2016 a montré une amélioration significative de la posture chez des participants après 8 semaines de Pilates Reformer.

## 2. Core en béton

Chaque exercice de Reformer engage le centre du corps. Ce n'est pas juste les abdos visibles (rectus abdominis), mais aussi le transverse, les obliques et les muscles du plancher pelvien.

**Le résultat** : Un ventre plus plat, mais surtout une stabilité fonctionnelle qui protège ton dos.

## 3. Souplesse augmentée

Les exercices d'étirement sur Reformer utilisent les sangles et le mouvement du chariot pour aller plus loin qu'au sol. Les hanches, les ischio-jambiers et la colonne gagnent en amplitude.

## 4. Force sans volume

Le Pilates développe des muscles longs et toniques plutôt que volumineux. Les ressorts créent une résistance qui renforce sans hypertrophier.

**Idéal pour** : Ceux qui veulent être forts et athlétiques sans prendre de masse.

## 5. Équilibre et coordination améliorés

Le travail sur surface instable (le chariot bouge !) développe la proprioception. Ton cerveau apprend à mieux contrôler ton corps dans l'espace.

## 6. Récupération sportive accélérée

De nombreux athlètes utilisent le Reformer comme outil de récupération active. Le mouvement contrôlé favorise la circulation sanguine et l'élimination des toxines.

**Combo gagnant** : Une séance légère de Reformer + une Tamarque pour les protéines = récupération optimale.

## 7. Mal de dos soulagé

Le renforcement des muscles profonds du dos et du core réduit la pression sur les vertèbres et les disques. Beaucoup de kinés recommandent le Reformer pour les lombalgies chroniques.

**Attention** : Si tu as des problèmes de dos, consulte un professionnel avant de commencer.

## 8. Respiration optimisée

Le Pilates enseigne une respiration thoracique latérale qui optimise la capacité pulmonaire et la connexion corps-esprit. Cette respiration profonde réduit aussi le stress.

## 9. Conscience corporelle développée

Tu apprends à sentir exactement quels muscles travaillent, à détecter les déséquilibres, à bouger avec intention. Cette awareness se transfère dans tous les aspects de ta vie.

## 10. Mental renforcé

La concentration requise pour chaque mouvement crée un état de flow similaire à la méditation. Tu sors de ta séance mentalement plus clair et moins stressé.

## Combien de temps pour voir des résultats ?

Joseph Pilates disait : "En 10 séances tu sens la différence, en 20 tu vois la différence, en 30 tu as un corps tout neuf."

C'est assez juste. Voici une timeline réaliste :

- **Semaines 1-2** : Meilleure conscience corporelle, possible courbatures
- **Semaines 3-4** : Posture qui s'améliore, core plus engagé
- **Semaines 5-8** : Changements visibles, plus de force et souplesse
- **3+ mois** : Transformation significative du corps et de la façon de bouger

## Maximise tes résultats

Le Pilates transforme ton corps, mais il a besoin des bons nutriments pour le faire. Assure-toi d'avoir un apport protéique suffisant pour reconstruire les fibres musculaires sollicitées. Les boissons protéinées légères comme Tamarque sont parfaites – elles n'alourdissent pas l'estomac, crucial pour une discipline qui travaille beaucoup le ventre.
    `,
  },
  'pilates-reformer-exercices-debutants': {
    title: '8 exercices de Pilates Reformer pour débutants',
    excerpt: 'Les mouvements essentiels pour bien démarrer sur le Reformer.',
    author: { name: 'Claire Fontaine' },
    publishedAt: '8 février 2024',
    readTime: '12 min',
    category: 'Pilates',
    content: `
Tu débutes sur le Reformer ? Ces 8 exercices forment la base de ta pratique. Maîtrise-les avant de passer aux mouvements avancés.

## 1. Footwork (travail des pieds)

**Position** : Allongé sur le dos, pieds sur la barre (footbar), bras le long du corps.

**Mouvement** : Pousse sur la barre pour étendre les jambes, puis reviens lentement.

**Variations** :
- Pieds parallèles, largeur des hanches
- Pieds en V (talons joints, orteils écartés)
- Talons sur la barre
- Sur les orteils (relevé)

**Muscles ciblés** : Quadriceps, fessiers, mollets, core

**Tips** :
- Garde le bassin neutre (petite courbe naturelle du bas du dos)
- Contrôle le retour – c'est là que ça travaille vraiment
- 10 répétitions de chaque variation

## 2. The Hundred (le cent)

**Position** : Allongé, tête et épaules décollées, jambes en table (90°) ou tendues à 45°.

**Mouvement** : Pompe les bras vers le haut et le bas en maintenant la position. 5 pompes sur l'inspire, 5 sur l'expire. 10 cycles = 100 pompes.

**Muscles ciblés** : Abdominaux, stabilisateurs du tronc

**Tips** :
- Garde le bas du dos au contact du chariot
- Si ton cou fatigue, pose la tête
- Commence jambes en table, progresse vers jambes tendues

## 3. Leg Circles (cercles de jambes)

**Position** : Allongé, pieds dans les sangles, jambes vers le plafond.

**Mouvement** : Dessine des cercles avec les jambes, en gardant le bassin stable.

**Muscles ciblés** : Fléchisseurs de hanches, adducteurs, abdominaux

**Tips** :
- Commence par de petits cercles
- Le bassin ne doit pas bouger – c'est le vrai challenge
- 5-8 cercles dans chaque sens

## 4. Short Spine (colonne courte)

**Position** : Allongé, pieds dans les sangles.

**Mouvement** :
1. Amène les genoux vers la poitrine
2. Roule la colonne vertébrale vers le plafond
3. Plie les genoux vers les épaules
4. Déroule vertèbre par vertèbre

**Muscles ciblés** : Toute la chaîne postérieure, abdominaux

**Tips** :
- C'est un massage pour ta colonne
- Déroule très lentement
- Respire profondément

## 5. Elephant

**Position** : Debout sur le chariot, mains sur la barre, dos arrondi comme un éléphant.

**Mouvement** : Pousse le chariot en arrière avec les jambes, puis reviens.

**Muscles ciblés** : Ischio-jambiers, core, épaules

**Tips** :
- Garde le dos arrondi tout au long
- Pousse depuis les talons
- Le mouvement vient des hanches, pas du dos

## 6. Knee Stretches

**Position** : À quatre pattes sur le chariot, mains sur la barre, genoux sur le chariot.

**Mouvement** : Pousse le chariot en arrière en gardant le dos stable.

**Variations** :
- Dos rond
- Dos plat
- Genoux décollés (avancé)

**Muscles ciblés** : Core, quadriceps, épaules

**Tips** :
- Le mouvement est petit et contrôlé
- Engage les abdos avant de bouger
- 10 répétitions de chaque variation

## 7. Long Stretch

**Position** : Planche, mains sur la barre, pieds contre les blocs d'épaule.

**Mouvement** : Pousse le chariot en arrière en maintenant la planche, puis reviens.

**Muscles ciblés** : Tout le corps – core, épaules, jambes

**Tips** :
- Garde une ligne droite de la tête aux talons
- Ne laisse pas les hanches s'affaisser
- C'est un exercice avancé – commence par des demi-mouvements

## 8. Mermaid (sirène)

**Position** : Assis en sirène (jambes pliées sur le côté), une main sur la barre.

**Mouvement** : Pousse la barre pour étirer le flanc, puis reviens.

**Muscles ciblés** : Obliques, intercostaux, épaules

**Tips** :
- C'est un étirement, pas un renforcement
- Respire profondément dans l'étirement
- Répète des deux côtés

## Programme débutant type

**Semaines 1-2** : Footwork + Hundred + Leg Circles
**Semaines 3-4** : Ajoute Short Spine + Elephant
**Semaines 5-6** : Ajoute Knee Stretches + Mermaid
**Semaines 7+** : Intègre Long Stretch

## Après ta séance

Les exercices de Reformer sollicitent les muscles en profondeur. Pour optimiser ta récupération :
- Hydrate-toi bien
- Consomme des protéines dans l'heure qui suit
- Une Tamarque apporte 20g de protéines sans alourdir l'estomac – parfait après un travail abdominal intense
    `,
  },
  'pilates-reformer-mal-de-dos': {
    title: 'Pilates Reformer et mal de dos : la solution douce',
    excerpt: 'Comment le Reformer peut soulager et prévenir les douleurs dorsales.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '5 février 2024',
    readTime: '9 min',
    category: 'Pilates',
    content: `
Le mal de dos touche 80% des adultes à un moment de leur vie. Et si le Pilates Reformer était la solution que tu cherches ? Décryptage d'une approche douce mais efficace.

## Pourquoi le dos souffre

Avant de parler solution, comprenons le problème :

**Causes mécaniques courantes :**
- Muscles profonds du tronc faibles (transverse, multifides)
- Déséquilibre musculaire (abdos/dos)
- Mauvaise posture prolongée
- Manque de mobilité de la colonne
- Hanches et ischio-jambiers raides

Le Reformer adresse chacun de ces points.

## Comment le Reformer aide

**1. Renforcement des stabilisateurs profonds**

Les muscles multifides et transverse sont les "corsets naturels" de ta colonne. Le Reformer les cible spécifiquement grâce à des exercices de stabilisation.

**2. Position allongée = décompression**

Beaucoup d'exercices se font allongé, ce qui décharge la colonne vertébrale. Le mouvement du chariot crée même une légère traction bénéfique.

**3. Résistance contrôlée**

Les ressorts permettent de travailler à la bonne intensité. Pas de risque de forcer ou de faire un faux mouvement.

**4. Mobilité segmentaire**

Les exercices comme le Short Spine ou le Pelvic Curl mobilisent la colonne vertèbre par vertèbre, restaurant la mobilité perdue.

## Exercices spécifiques pour le dos

**Pelvic Curl (pont)**
- Allongé, pieds sur la barre
- Déroule la colonne du sol vertèbre par vertèbre
- Redescends aussi lentement
- 6-8 répétitions

**Cat-Cow sur le chariot**
- À quatre pattes sur le chariot
- Alterne dos rond et dos creux
- Fluidifie la colonne

**Spine Stretch Forward**
- Assis face aux sangles
- Roule la colonne vers l'avant
- Étire tout le dos

**Swimming (adaptation)**
- À plat ventre sur le box
- Lève alternativement bras et jambes
- Renforce les extenseurs du dos

## Précautions importantes

⚠️ **Consulte un professionnel avant de commencer** si tu as :
- Hernie discale diagnostiquée
- Sciatique aiguë
- Sténose spinale
- Tout problème vertébral connu

⚠️ **Pendant la pratique :**
- Évite les mouvements qui reproduisent la douleur
- Progresse très graduellement
- Préviens toujours l'instructeur de ton historique

## Témoignage type

"J'avais des lombalgies chroniques depuis 5 ans. Après 3 mois de Reformer, 2 fois par semaine, mes douleurs ont diminué de 80%. Je n'ai plus besoin d'anti-inflammatoires." – Marie, 42 ans

C'est un témoignage classique. Le Reformer ne guérit pas miraculeusement, mais il s'attaque aux causes mécaniques du mal de dos.

## Programme pour dos fragile

**Semaine 1-2** : Pelvic Curl + Footwork léger (1 ressort)
**Semaine 3-4** : Ajoute Cat-Cow + Leg Circles (petit amplitude)
**Semaine 5-6** : Intègre Spine Stretch Forward
**Semaine 7+** : Progression graduelle selon tolérance

**Fréquence** : 2 fois par semaine minimum, jamais 2 jours consécutifs au début.

## L'importance de la nutrition anti-inflammatoire

Le mal de dos a souvent une composante inflammatoire. En plus du Pilates :
- Privilégie les oméga-3 (poissons gras, noix)
- Évite les aliments ultra-transformés
- Assure un apport protéique suffisant pour la réparation tissulaire

Une Tamarque après ta séance apporte 20g de protéines pures pour aider tes muscles à récupérer et se renforcer.

## Le mot du kiné

"Je recommande le Pilates Reformer à mes patients souffrant de lombalgies chroniques. La machine permet un travail ciblé et progressif impossible à reproduire au sol. C'est devenu un outil thérapeutique à part entière." – Dr. Lucas Bernard
    `,
  },
  'pilates-reformer-musculation-complementaire': {
    title: 'Pilates Reformer et musculation : le duo gagnant',
    excerpt: 'Pourquoi les bodybuilders et crossfitters intègrent le Reformer dans leur routine.',
    author: { name: 'Emma Dubois' },
    publishedAt: '3 février 2024',
    readTime: '8 min',
    category: 'Pilates',
    content: `
Tu soulèves de la fonte et tu penses que le Pilates n'est pas pour toi ? Détrompe-toi. De plus en plus d'athlètes de force intègrent le Reformer dans leur routine – et leurs résultats parlent d'eux-mêmes.

## Pourquoi les sportifs de force s'y mettent

**LeBron James, David Beckham, Tiger Woods**... Ces athlètes d'élite pratiquent le Pilates. Pourquoi ? Parce que la force brute ne suffit pas. Il faut aussi :
- Mobilité articulaire
- Stabilité du core
- Équilibre musculaire
- Prévention des blessures

Le Reformer apporte tout ça.

## Les bénéfices pour le pratiquant de musculation

**1. Mobilité des hanches et épaules**

Le squat profond, le deadlift, le overhead press – tous ces mouvements demandent une mobilité que la musculation seule ne développe pas. Le Reformer ouvre les hanches et assouplit les épaules.

**2. Activation du core profond**

Tu fais des abdos ? Super. Mais actives-tu vraiment ton transverse pendant tes lifts lourds ? Le Pilates enseigne cette activation qui protège ta colonne.

**3. Correction des déséquilibres**

La musculation peut créer des déséquilibres : pectoraux dominants sur le dos, quadriceps sur ischio-jambiers. Le Reformer rééquilibre tout ça.

**4. Récupération active**

Une séance légère de Reformer entre deux grosses séances favorise la circulation sanguine et la récupération sans ajouter de stress supplémentaire.

## Programme type : musculation + Reformer

**Lundi** : Push (pectoraux, épaules, triceps)
**Mardi** : Reformer - focus mobilité et core
**Mercredi** : Pull (dos, biceps)
**Jeudi** : Repos ou cardio léger
**Vendredi** : Legs
**Samedi** : Reformer - focus étirements et récupération
**Dimanche** : Repos

## Exercices de Reformer pour les musclés

**Pour les squatteurs :**
- Footwork en V pour la mobilité des hanches
- Frog pour ouvrir les adducteurs
- Elephant pour les ischio-jambiers

**Pour les bencheurs :**
- Arm work avec les sangles pour l'équilibre épaules
- Chest expansion pour ouvrir les pectoraux
- Mermaid pour la mobilité thoracique

**Pour les deadlifteurs :**
- Short Spine pour la mobilité de la colonne
- Leg Circles pour les fléchisseurs de hanches
- Swan pour renforcer les extenseurs du dos

## Témoignages d'athlètes

"J'ai ajouté 20kg à mon squat en 3 mois après avoir commencé le Reformer. Ma mobilité de hanches a tout changé." – Marc, powerlifter

"Mes épaules me faisaient mal depuis des années. Le Reformer les a réparées. Je benche maintenant sans douleur." – Julie, fitness

## Le timing idéal

**Avant la muscu ?** Possible pour activer le core, mais garde l'intensité légère.

**Après la muscu ?** Excellent pour étirer et récupérer.

**Jour séparé ?** Idéal pour vraiment travailler la mobilité sans fatigue.

## Nutrition adaptée

Quand tu combines musculation et Pilates, tes besoins en protéines augmentent. Tu sollicites plus de fibres musculaires, tu as besoin de plus de matériaux de reconstruction.

Vise 1.8-2.2g de protéines par kg de poids corporel. Une Tamarque après chaque séance (muscu ou Reformer) t'apporte 20g de protéines facilement assimilables.

## Conclusion

Le Pilates Reformer n'est pas un "sport de filles" ou une activité de récupération passive. C'est un outil d'entraînement puissant qui complète parfaitement la musculation. Les athlètes les plus performants l'ont compris – et toi ?
    `,
  },
  'pilates-reformer-grossesse': {
    title: 'Pilates Reformer pendant la grossesse : guide trimestre par trimestre',
    excerpt: 'Le Reformer est idéal pour rester active enceinte.',
    author: { name: 'Claire Fontaine' },
    publishedAt: '1er février 2024',
    readTime: '11 min',
    category: 'Pilates',
    content: `
Enceinte et envie de continuer le sport ? Le Pilates Reformer est l'une des meilleures options. Voici comment adapter ta pratique trimestre par trimestre.

## Pourquoi le Reformer est idéal pendant la grossesse

**Position allongée possible** : Même quand le ventre grossit, les exercices sur le dos sont possibles grâce à l'inclinaison du chariot.

**Résistance ajustable** : Tu peux baisser l'intensité selon ton énergie du jour.

**Travail du plancher pelvien** : Fondamental pour la grossesse et l'accouchement.

**Posture maintenue** : Contrebalance le poids du ventre qui tire vers l'avant.

**Impact zéro** : Pas de sauts, pas de chocs – parfait pour protéger bébé.

## Premier trimestre (semaines 1-12)

C'est la période la plus délicate hormonalement, mais souvent tu ne "sens" pas encore la grossesse physiquement.

**Ce qui change :**
- Fatigue possible
- Nausées fréquentes
- Ligaments qui commencent à se relâcher (relaxine)

**Exercices OK :**
- Footwork (toutes variations)
- Hundred (version classique encore possible)
- Leg Circles
- Short Spine
- La plupart des exercices habituels

**Précautions :**
- Évite les exercices où tu risques de tomber
- Écoute ta fatigue – réduis l'intensité si besoin
- Hydrate-toi plus que d'habitude

## Deuxième trimestre (semaines 13-26)

Souvent appelé le "trimestre en or" – l'énergie revient, les nausées passent.

**Ce qui change :**
- Ventre qui apparaît
- Centre de gravité qui se déplace
- Ligaments plus lâches

**Exercices à adapter :**
- Hundred : pieds au sol ou sur la barre au lieu de jambes en l'air
- Exercices sur le dos : surélève la tête du chariot avec un coussin
- Évite les grands écarts et étirements extrêmes (ligaments fragiles)

**Exercices recommandés :**
- Footwork (renforce les jambes pour porter le poids)
- Side-lying series (travail des hanches sur le côté)
- Arm work assis (maintient le haut du corps)
- Mermaid (soulage le dos)

## Troisième trimestre (semaines 27-40)

Le ventre prend beaucoup de place. L'objectif devient : maintenir la mobilité et préparer l'accouchement.

**Ce qui change :**
- Essoufflement plus rapide
- Difficulté à s'allonger sur le dos
- Rétention d'eau possible
- Besoin de positions plus hautes

**Exercices à privilégier :**
- Footwork (indispensable pour les jambes)
- Exercices assis ou debout
- Travail des bras avec les sangles
- Étirements doux

**Exercices à éviter :**
- Tout exercice sur le dos prolongé (compression de la veine cave)
- Hundred classique
- Exercices qui compriment le ventre
- Mouvements d'équilibre risqués

## Focus : le plancher pelvien

Le Pilates est excellent pour le périnée. Pendant la grossesse, renforce-le en douceur :
- Engagements légers pendant les exercices
- Pas de "serrage" maximal (les muscles doivent aussi savoir se relâcher)
- Respiration coordonnée : expire = engagement léger

## Contre-indications absolues

🚫 Arrête immédiatement et consulte si :
- Saignements
- Contractions régulières avant terme
- Fuite de liquide amniotique
- Douleur pelvienne intense
- Vertige ou malaise

🚫 Ne pratique pas si tu as :
- Grossesse à risque diagnostiquée
- Placenta prævia
- Col raccourci ou ouvert
- Antécédent d'accouchement prématuré

## Nutrition pendant la grossesse sportive

Tu portes un bébé ET tu t'entraînes. Tes besoins augmentent.

**Protéines** : Essentielles pour la croissance de bébé et le maintien de ta masse musculaire. Vise 70-100g par jour.

**Hydratation** : Encore plus importante qu'avant. Minimum 2L d'eau par jour.

**Tamarque** peut être une bonne option : 20g de protéines, ingrédients naturels, texture légère qui passe bien même avec les nausées. Vérifie avec ton médecin si tu as des questions sur les compléments.

## Après l'accouchement

Le Reformer est excellent pour la rééducation post-partum, mais attends :
- 6 semaines minimum (accouchement voie basse)
- 8-12 semaines (césarienne)
- Le feu vert de ton médecin et ta sage-femme

Reprends très progressivement, en te concentrant d'abord sur le plancher pelvien et le transverse.
    `,
  },
  'pilates-reformer-runners-coureurs': {
    title: 'Pilates Reformer pour les coureurs : améliore ta foulée',
    excerpt: 'Comment le Reformer peut transformer ta course.',
    author: { name: 'Sophie Martin' },
    publishedAt: '28 janvier 2024',
    readTime: '8 min',
    category: 'Pilates',
    content: `
Tu cours régulièrement mais tu stagnes ? Tu enchaînes les blessures ? Le Pilates Reformer pourrait être le chaînon manquant de ton entraînement.

## Pourquoi les coureurs ont besoin du Reformer

La course est un mouvement répétitif unidirectionnel. Tu avances, toujours dans le même plan. Résultat :
- Certains muscles deviennent trop forts
- D'autres restent faibles
- La mobilité diminue
- Les blessures arrivent

Le Reformer corrige tous ces déséquilibres.

## Les blessures typiques du coureur (et comment le Reformer aide)

**Syndrome de l'essuie-glace (IT band)**
- Cause : Faiblesse des abducteurs et stabilisateurs de hanche
- Solution Reformer : Side-lying series, Leg Circles, travail en abduction

**Périostite tibiale (shin splints)**
- Cause : Déséquilibre mollets/tibial antérieur, chocs répétés
- Solution Reformer : Footwork complet, renforcement équilibré sans impact

**Fasciite plantaire**
- Cause : Mollets tendus, pieds faibles
- Solution Reformer : Étirements des mollets, travail des pieds sur la barre

**Douleurs de genou (runner's knee)**
- Cause : Quadriceps dominant, VMO faible, tracking rotulien
- Solution Reformer : Footwork ciblé, renforcement équilibré des cuisses

## Les exercices clés pour les coureurs

**1. Footwork complet**
- Toutes les positions : parallèle, V, talons, orteils
- Renforce les jambes de façon équilibrée
- 10 reps de chaque position

**2. Running on the Reformer**
- Simule la foulée en position allongée
- Travaille la coordination et l'alternance des jambes
- Excellent pour le neutre pelvien

**3. Single Leg Work**
- Footwork sur une jambe
- Révèle et corrige les déséquilibres droite/gauche
- Essentiel car la course est une succession d'appuis unilatéraux

**4. Hip Work (Side-lying)**
- Abduction, adduction, cercles
- Renforce les stabilisateurs de hanche
- Prévient le syndrome de l'IT band

**5. Elephant et Down Stretch**
- Étire les ischio-jambiers et mollets
- Renforce le core en position fonctionnelle

**6. Spine Stretch Forward**
- Mobilise la colonne thoracique
- Améliore la posture de course

## Programme type : coureur + Reformer

**Pour un coureur de 3-4 sorties/semaine :**

Lundi : Course facile
Mardi : Reformer (45-60 min)
Mercredi : Course intervalles
Jeudi : Repos ou cross-training
Vendredi : Course facile
Samedi : Sortie longue
Dimanche : Reformer récup (30 min) ou repos

## Quand placer la séance de Reformer ?

**Jamais juste avant une sortie intense** : Le Reformer fatigue les muscles stabilisateurs dont tu as besoin pour courir.

**Idéal** : Jour de repos de course ou après une sortie facile.

**Récupération** : Une séance légère de Reformer le lendemain d'une sortie longue favorise la récupération.

## Témoignage

"J'étais blessé tous les 3 mois. Depuis que j'ai ajouté 2 séances de Reformer par semaine, je n'ai plus rien eu en 18 mois. Et mon temps au semi-marathon a baissé de 8 minutes." – Thomas, 35 ans, coureur amateur

## La nutrition du coureur qui fait du Reformer

Tu cumules deux types d'entraînement : endurance (course) et renforcement (Reformer). Tes besoins augmentent.

**Protéines** : 1.4-1.8g par kg de poids corporel
**Glucides** : Suffisamment pour alimenter tes courses
**Hydratation** : Fondamentale pour les deux activités

Après ta séance de Reformer, une Tamarque t'apporte 20g de protéines sous forme légère et digeste. Parfait avant d'enchaîner sur ta journée ou ta prochaine sortie course.

## Conclusion

Le Pilates Reformer n'est pas qu'un complément pour les coureurs – c'est un outil de performance et de prévention. Les élites l'ont compris. Les coureurs récréatifs qui l'adoptent voient leurs chronos baisser et leurs blessures disparaître. Et toi, tu attends quoi ?
    `,
  },
  'pilates-reformer-posture-bureau': {
    title: 'Pilates Reformer : 6 exercices anti-posture de bureau',
    excerpt: 'Tu passes tes journées assis ? Ces exercices vont contrer les effets néfastes.',
    author: { name: 'Claire Fontaine' },
    publishedAt: '25 janvier 2024',
    readTime: '7 min',
    category: 'Pilates',
    content: `
8 heures assis devant un écran, ça laisse des traces. Épaules enroulées, dos voûté, hanches fermées... Le Reformer est l'antidote parfait à la posture de bureau.

## Ce que la position assise fait à ton corps

**Hanches** : Les fléchisseurs raccourcissent, les extenseurs (fessiers) s'endorment.

**Dos** : Les muscles posturaux s'affaiblissent, la cyphose thoracique s'accentue.

**Épaules** : Elles s'enroulent vers l'avant, les pectoraux se raccourcissent.

**Cou** : La tête avance (forward head posture), créant des tensions.

**Core** : Il se désactive complètement – tu t'affales sur ta chaise.

## 6 exercices correctifs sur Reformer

### 1. Chest Expansion (expansion thoracique)

**Position** : À genoux face aux sangles, une sangle dans chaque main.

**Mouvement** : Tire les bras vers l'arrière, ouvre la poitrine, tourne la tête de chaque côté.

**Pourquoi** : Ouvre les pectoraux raccourcis, renforce le haut du dos, mobilise le cou.

**Répétitions** : 8-10

### 2. Swan (le cygne)

**Position** : À plat ventre sur le long box, mains sur la barre.

**Mouvement** : Pousse sur la barre pour soulever le buste, extension de la colonne.

**Pourquoi** : Renforce les extenseurs du dos, contrecarre la cyphose.

**Répétitions** : 6-8

### 3. Eve's Lunge (fente d'Eve)

**Position** : Un pied sur le chariot, l'autre sur la plateforme fixe.

**Mouvement** : Pousse le chariot en arrière, créant un étirement de fléchisseur de hanche.

**Pourquoi** : Ouvre les hanches fermées par la position assise.

**Durée** : 30 secondes chaque côté, 2-3 fois

### 4. Mermaid (sirène)

**Position** : Assis en sirène, une main sur la barre.

**Mouvement** : Pousse la barre pour étirer le flanc, puis reviens.

**Pourquoi** : Étire les muscles intercostaux comprimés en position assise, mobilise la colonne latéralement.

**Répétitions** : 5 chaque côté

### 5. Scapular Isolation (isolation des omoplates)

**Position** : Assis face aux sangles, bras tendus devant.

**Mouvement** : Sans plier les coudes, rapproche puis écarte les omoplates.

**Pourquoi** : Réveille les muscles entre les omoplates qui s'affaissent devant l'écran.

**Répétitions** : 10-12

### 6. Footwork en V + relevé

**Position** : Allongé, pieds en V sur la barre, sur les orteils.

**Mouvement** : Pousse et reviens en gardant les talons hauts.

**Pourquoi** : Contrecarre l'inactivité des mollets et des pieds en position assise. Active toute la chaîne postérieure.

**Répétitions** : 15-20

## Programme anti-bureau

Fais cette séquence 2-3 fois par semaine :

1. Footwork complet (échauffement) – 5 min
2. Chest Expansion – 8 reps
3. Swan – 6 reps
4. Eve's Lunge – 30 sec/côté x 2
5. Scapular Isolation – 12 reps
6. Mermaid – 5/côté
7. Stretching final – 5 min

Total : 30-40 minutes

## Ce que tu peux faire au bureau

Entre deux séances de Reformer :

**Toutes les heures** :
- Lève-toi et marche 2 minutes
- Fais 5 rotations d'épaules
- Étire ton cou de chaque côté

**À midi** :
- Marche 15 minutes après manger
- Fais quelques squats et fentes

**Le soir** :
- 5 minutes d'étirements avant de dormir

## La nutrition du sédentaire actif

Tu passes tes journées assis mais tu fais du Reformer pour compenser. Quelques points nutrition :

**Protéines** : Essentielles pour maintenir ta masse musculaire malgré l'inactivité de journée. Vise 1.2-1.5g par kg.

**Anti-inflammatoires naturels** : La position assise crée de l'inflammation chronique. Oméga-3, curcuma, légumes colorés.

**Évite** : Les snacks sucrés qui appellent le snacking. Les gros repas qui alourdissent.

Une Tamarque en collation d'après-midi t'évite le coup de barre de 16h tout en t'apportant 20g de protéines. Bien mieux qu'un café-biscuit !

## Conclusion

La position assise est le "nouveau tabac" selon certains experts. Tu ne peux peut-être pas changer ton job, mais tu peux contrer ses effets. Le Reformer est l'outil idéal pour défaire ce que 8 heures de bureau font à ton corps. Ton dos, tes épaules et tes hanches te remercieront.
    `,
  },
  'pilates-reformer-nutrition-proteines': {
    title: 'Pilates Reformer : quelle nutrition pour optimiser tes séances ?',
    excerpt: 'Avant, pendant, après... Comment bien manger autour de tes séances de Reformer.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '22 janvier 2024',
    readTime: '9 min',
    category: 'Pilates',
    content: `
Le Pilates Reformer travaille tes muscles en profondeur. Pour en tirer tous les bénéfices, ta nutrition doit suivre. Voici le guide complet.

## Le Pilates brûle-t-il des calories ?

Moins que le cardio intense, mais plus qu'on ne le pense. Une séance de 45 minutes brûle environ 200-400 calories selon l'intensité et ton poids.

Mais l'intérêt n'est pas là. Le Pilates construit du muscle maigre, et le muscle brûle des calories au repos. C'est un investissement à long terme.

## Avant la séance

**Timing** : Mange 1h30-2h avant ta séance. L'estomac doit être léger car beaucoup d'exercices compriment le ventre.

**Quoi manger** :
- Glucides faciles à digérer (fruit, flocons d'avoine)
- Un peu de protéines (yaourt, œuf)
- Peu de graisses (ralentissent la digestion)

**Exemples** :
- Banane + quelques amandes
- Yaourt grec + fruits
- Tartine pain complet + beurre de cacahuète léger

**À éviter** :
- Repas copieux
- Aliments gras ou frits
- Fibres en excès (ballonnements)

## Pendant la séance

Le Pilates Reformer n'est généralement pas assez long ou intense pour nécessiter une nutrition pendant l'effort.

**Hydratation** : Bois de petites gorgées d'eau entre les exercices. Pas de grandes quantités d'un coup.

## Après la séance : la fenêtre d'opportunité

C'est LE moment crucial. Tes muscles ont travaillé, les fibres ont été sollicitées, ton corps est prêt à reconstruire.

**Timing** : Dans les 30-60 minutes suivant la séance.

**Objectifs** :
1. Apporter des protéines pour la reconstruction musculaire
2. Reconstituer les réserves de glycogène
3. Réhydrater

**Pourquoi Tamarque est parfait après le Pilates** :
- 20g de protéines d'isolat de whey (absorption rapide)
- Texture légère qui passe même après un travail abdominal
- Zéro ballonnement
- Hydratation simultanée

## Les besoins protéiques du pratiquant de Pilates

Le Pilates est un entraînement en résistance. Contrairement à ce qu'on croit, il sollicite vraiment les muscles – particulièrement les muscles profonds.

**Recommandation** : 1.2-1.6g de protéines par kg de poids corporel par jour.

Pour une femme de 60kg : 72-96g de protéines par jour
Pour un homme de 80kg : 96-128g de protéines par jour

**Répartition idéale** : 20-30g par repas, 3-4 fois par jour.

## Exemple de journée alimentaire (jour de Pilates)

**7h00 - Petit-déjeuner**
- Œufs brouillés (2) sur pain complet
- Fruits frais
- Thé ou café

**10h30 - Collation**
- Yaourt grec + miel + noix
- ~20g de protéines

**12h30 - Déjeuner**
- Poulet grillé + quinoa + légumes
- ~30g de protéines

**15h00 - Pré-workout (1h30 avant)**
- Banane + quelques amandes

**16h30 - Séance Pilates Reformer**

**17h30 - Post-workout**
- Tamarque Mango Sunrise
- ~20g de protéines

**20h00 - Dîner**
- Saumon + patates douces + brocoli
- ~25g de protéines

**Total** : ~95-100g de protéines

## Hydratation

Le Pilates ne fait pas transpirer autant que le cardio, mais l'hydratation reste cruciale :
- Eau tout au long de la journée
- Petites gorgées pendant la séance
- Réhydratation après

**Objectif** : 2-2.5L d'eau par jour minimum.

## Suppléments utiles

**Essentiels** :
- Protéines (si tu n'atteins pas tes besoins via l'alimentation)
- Vitamine D (si tu manques de soleil)
- Oméga-3 (anti-inflammatoire)

**Optionnels** :
- Magnésium (récupération musculaire, sommeil)
- Collagène (santé articulaire)

## Erreurs nutritionnelles courantes

❌ **Jeûner avant le Pilates** : Tu manqueras d'énergie et ton travail sera moins efficace.

❌ **Négliger les protéines post-séance** : Tes muscles ne récupéreront pas optimalement.

❌ **Sous-manger parce que "ce n'est que du Pilates"** : Le Reformer est un vrai entraînement. Ton corps a besoin de carburant.

❌ **Manger trop juste avant** : Tu seras mal à l'aise pendant les exercices abdominaux.

## Le mot de la fin

Le Pilates Reformer sculpte ton corps de l'intérieur. Pour maximiser cette transformation, donne à ton corps les bons nutriments au bon moment. Une nutrition adaptée ne fera pas que t'aider à récupérer – elle accélérera tes progrès visibles.
    `,
  },
  'top-5-recettes-post-entrainement': {
    title: 'Top 5 des recettes protéinées post-entraînement avec Tamarque',
    excerpt: 'Découvre des façons délicieuses et originales de consommer tes protéines après une séance intense.',
    author: { name: 'Sophie Martin' },
    publishedAt: '20 janvier 2024',
    readTime: '5 min',
    category: 'Recettes',
    content: `
Après une séance intense, ton corps réclame des protéines pour réparer et construire du muscle. Mais qui a dit que la nutrition post-entraînement devait être ennuyeuse ? Avec les boissons protéinées légères de Tamarque, tu peux créer des recettes rafraîchissantes et délicieuses qui transforment la récupération en moment de plaisir.

## 1. Smoothie Bowl Tropical Sunrise

Mixe une Tamarque Mango Sunrise avec de la mangue congelée et un splash de lait de coco. Verse dans un bol et garnis de granola, de banane en tranches et de noix de coco râpée. La texture légère et rafraîchissante est parfaite pour les matins d'été après ta séance.

**Macros :** 25g protéines • 45g glucides • 8g lipides

## 2. Popsicles Dragon Fruit

Verse ta Tamarque Dragon Fruit Rush dans des moules à glace et congèle pendant 4 heures. Tu obtiens une gourmandise glacée riche en protéines, parfaite pour la récup' les jours de chaleur. Chaque popsicle t'offre une explosion de fruits exotiques avec tous les bénéfices protéinés.

**Astuce :** Ajoute des morceaux de fruits frais avant de congeler pour encore plus de texture !

## 3. Parfait Protéiné aux Fruits Rouges

Alterne des couches de Tamarque Berry Boost avec du yaourt grec et des fruits rouges frais. Ajoute un filet de miel et quelques amandes concassées. Les différentes textures rendent chaque bouchée intéressante, et tu cumules les sources de protéines.

**Macros :** 35g protéines • 30g glucides • 10g lipides

## 4. Recovery Bowl façon Açaí

Utilise la Tamarque Dragon Fruit Rush comme base d'un bowl style açaí. Mixe avec une banane congelée pour plus d'onctuosité, puis garnis de fruits frais, graines de chia et une poignée de noix. La couleur rose vibrante est aussi Instagram-worthy que nutritive.

## 5. Chia Pudding Citrus Energy

Mélange ta Tamarque Citrus Energy avec des graines de chia et laisse reposer toute la nuit au frigo. Le lendemain matin, tu as un pudding riche en protéines avec une couleur éclatante et un goût d'agrumes subtil. Garnis de zestes de citron et de quelques framboises pour les antioxydants.

**Ratio idéal :** 250ml Tamarque + 3 cuillères à soupe de graines de chia

## Pourquoi ces recettes fonctionnent

La clé de toutes ces recettes, c'est la texture unique légère de Tamarque. Contrairement aux shakes épais et crémeux, nos boissons se mélangent parfaitement aux recettes sans les alourdir ni leur donner ce goût crayeux qu'on déteste tous. Tu obtiens 20g de protéines sous une forme vraiment agréable à consommer.

Prêt à tester ces recettes ? Explore notre gamme complète de saveurs et commence à créer tes propres chefs-d'œuvre post-entraînement.
    `,
  },
  'besoins-proteines-coureurs': {
    title: 'Combien de protéines pour les coureurs ? Le guide complet',
    excerpt: 'Décryptage scientifique des besoins en protéines des athlètes d\'endurance.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '15 janvier 2024',
    readTime: '8 min',
    category: 'Nutrition',
    content: `
Si tu es coureur, tu as probablement entendu des conseils contradictoires sur les protéines. Certains disent que les athlètes d'endurance ont besoin de moins de protéines que les pratiquants de musculation. D'autres affirment qu'il en faut autant, voire plus. Décryptons ensemble la science.

## Ce que dit la recherche

Les études récentes montrent que les athlètes d'endurance ont en réalité des besoins en protéines plus élevés qu'on ne le pensait. Alors que la recommandation générale pour les adultes sédentaires est de 0.8g par kg de poids corporel, les coureurs bénéficient de 1.2 à 1.6g par kg.

Pour un coureur de 70kg, ça représente 84 à 112g de protéines par jour. Pendant les périodes d'entraînement intensif ou la préparation marathon, les besoins peuvent grimper jusqu'à 1.8g par kg.

## Pourquoi les coureurs ont besoin de protéines

**Réparation musculaire** : La course provoque des micro-déchirures dans les fibres musculaires. Les protéines fournissent les acides aminés nécessaires à la réparation et à l'adaptation.

**Fonction immunitaire** : Les charges d'entraînement élevées peuvent affaiblir l'immunité. Un apport adéquat en protéines soutient la production de cellules immunitaires.

**Production d'énergie** : Bien que ce ne soit pas la source principale de carburant, les protéines peuvent contribuer à 5-10% de l'énergie pendant les sorties longues.

**Vitesse de récupération** : Un apport protéique correct réduit les courbatures et accélère la récupération entre les séances.

## Le timing, ça compte

La fenêtre des 30 minutes post-entraînement n'est pas un mythe pour les coureurs. Consommer 20-30g de protéines dans cette fenêtre maximise la synthèse protéique musculaire. C'est là que Tamarque brille – notre texture légère te permet de boire ta protéine juste après une sortie en sueur sans te sentir mal.

## La qualité avant la quantité

Toutes les protéines ne se valent pas. Cherche des protéines complètes contenant tous les acides aminés essentiels. L'isolat de protéine de whey, comme celui qu'on utilise chez Tamarque, a la biodisponibilité la plus élevée et l'absorption la plus rapide.

## Conseils pratiques pour les coureurs

1. Répartis ton apport protéique sur les repas (n'essaie pas de tout prendre au dîner)
2. Consomme des protéines dans les 30 minutes suivant ta course
3. Choisis des sources facilement digestibles avant les sorties
4. Pense aux protéines avant le coucher pour la récupération nocturne

**Le verdict ?** Les coureurs ont besoin de plus de protéines qu'ils ne le pensent, et la forme sous laquelle elles arrivent compte pour l'adhérence. Personne ne veut d'un shake lourd après un 20km – c'est pour ça qu'on a créé la texture légère et rafraîchissante de Tamarque.
    `,
  },
  'proteine-legere-revolution': {
    title: 'La révolution de la protéine légère : pourquoi la protéine claire change tout',
    excerpt: 'Pourquoi les athlètes abandonnent les shakes épais pour les boissons protéinées légères et rafraîchissantes.',
    author: { name: 'Emma Dubois' },
    publishedAt: '10 janvier 2024',
    readTime: '6 min',
    category: 'Innovation',
    content: `
Pendant des décennies, "protéine" rimait avec "shake épais et crémeux". Cette texture lourde, souvent crayeuse, était considérée comme un mal nécessaire. Mais une nouvelle génération de boissons protéinées est en train de bouleverser le marché. Bienvenue dans l'ère de la protéine légère.

## Le problème des shakes traditionnels

Soyons honnêtes : après un entraînement intense, la dernière chose dont tu as envie, c'est d'un liquide épais et lourd qui reste sur l'estomac. Les shakes classiques posent plusieurs problèmes :

- **Sensation de lourdeur** post-consommation
- **Texture crayeuse** difficile à avaler
- **Ballonnements** fréquents
- **Palatabilité limitée**, surtout par temps chaud
- **Difficulté à s'hydrater** en même temps

## L'innovation de la protéine claire

La protéine claire (ou "clear whey") utilise de l'isolat de whey hydrolysé qui se dissout complètement dans l'eau, créant une boisson transparente et légère. Cette technologie représente une vraie révolution :

**Absorption ultra-rapide** : Sans les graisses et lactose des shakes traditionnels, la protéine arrive plus vite dans tes muscles.

**Hydratation simultanée** : Tu peux te réhydrater ET te protéiner en même temps – crucial après l'effort.

**Zéro inconfort digestif** : Fini les ballonnements et la sensation de lourdeur.

**Goût rafraîchissant** : Des saveurs fruitées qui se boivent avec plaisir, pas comme un "devoir".

## Pourquoi les athlètes font le switch

Les retours de terrain sont unanimes. Voici ce qu'on entend le plus souvent :

"Après un WOD intense, je ne supportais plus les shakes épais. Avec Tamarque, j'ai l'impression de boire une boisson désaltérante." – Marie, CrossFit

"En course à pied, l'hydratation est cruciale. Pouvoir combiner protéines et hydratation en une seule boisson a changé ma récup." – Thomas, marathonien

"Je prends ma Tamarque pendant l'entraînement maintenant, pas seulement après. Impossible avec un shake classique." – Julie, fitness

## Les chiffres parlent

Une étude récente montre que 73% des athlètes qui passent à la protéine claire reportent une meilleure adhérence à leur supplémentation. La raison ? Ils apprécient enfin ce qu'ils boivent.

## Comment Tamarque innove

Chez Tamarque, on a poussé l'innovation encore plus loin :

- **20g de protéines** par bouteille
- **100% d'ingrédients naturels** – pas d'édulcorants artificiels
- **5 saveurs fruitées** aux goûts exotiques
- **Format prêt à boire** – pas de shaker, pas de poudre

La révolution de la protéine légère n'est pas qu'une tendance. C'est l'évolution logique de la nutrition sportive vers des produits qu'on a réellement envie de consommer. Et ça, ça change tout pour ta régularité et donc tes résultats.
    `,
  },
  'ingredients-naturels-performance': {
    title: 'Pourquoi les ingrédients 100% naturels boostent ta performance',
    excerpt: 'La science derrière la nutrition clean et l\'impact des ingrédients artificiels sur tes performances.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '5 janvier 2024',
    readTime: '7 min',
    category: 'Santé',
    content: `
Dans le monde de la nutrition sportive, "naturel" est devenu un buzzword. Mais derrière le marketing, il y a une vraie science. Découvrons ensemble pourquoi les ingrédients 100% naturels peuvent réellement impacter ta performance.

## Le problème des additifs artificiels

La plupart des suppléments sportifs sont bourrés d'ingrédients qu'on ne trouverait jamais dans la nature : édulcorants de synthèse, colorants artificiels, conservateurs chimiques. Voici ce que la recherche nous dit sur leur impact :

**Édulcorants artificiels (aspartame, sucralose, acésulfame K)**
- Perturbation potentielle du microbiome intestinal
- Réponse insulinique paradoxale chez certaines personnes
- Effets sur l'appétit et les préférences gustatives

**Colorants artificiels**
- Inflammation systémique à faible bruit
- Réactions d'hypersensibilité chez les personnes sensibles
- Aucun bénéfice nutritionnel

**Conservateurs chimiques**
- Charge supplémentaire pour le foie
- Interaction potentielle avec d'autres nutriments

## L'avantage des ingrédients naturels

Quand tu consommes des ingrédients naturels, tu bénéficies de ce qu'on appelle la "matrice alimentaire" – l'ensemble des composés qui accompagnent naturellement un nutriment et optimisent son absorption et son utilisation.

**Meilleure biodisponibilité** : Les nutriments dans leur forme naturelle sont souvent mieux absorbés.

**Synergie nutritionnelle** : Les composés naturels travaillent ensemble (exemple : la vitamine C naturelle accompagnée de bioflavonoïdes).

**Moins de stress métabolique** : Ton corps n'a pas à traiter des molécules qu'il ne reconnaît pas.

## Ce que ça change pour ta performance

Les effets peuvent sembler subtils au quotidien, mais ils s'accumulent :

**Récupération optimisée** : Sans inflammation additionnelle due aux additifs, ton corps récupère plus efficacement.

**Énergie plus stable** : Pas de pics et de chutes liés aux édulcorants artificiels.

**Meilleure digestion** : Crucial pour absorber tous les nutriments de ta nutrition sportive.

**Santé à long terme** : Performance durable = santé durable.

## L'approche Tamarque

Chez Tamarque, on a fait le choix radical du 100% naturel :

- **Isolat de whey** de haute qualité comme unique source de protéines
- **Arômes naturels de fruits** pour le goût
- **Stévia** comme seul édulcorant – extrait de plante, zéro calorie
- **Aucun colorant** – nos couleurs viennent des extraits de fruits
- **Aucun conservateur** – durée de vie assurée par le processus de fabrication

## Comment lire les étiquettes

Pour identifier les produits vraiment naturels, cherche :

1. Une liste d'ingrédients courte et compréhensible
2. Aucun numéro E (E951, E950, etc.)
3. Des noms d'ingrédients que ta grand-mère reconnaîtrait
4. La mention "arômes naturels" plutôt que "arômes"

**Le verdict** : Les ingrédients naturels ne sont pas qu'un argument marketing. C'est un choix qui impacte réellement ta santé et ta performance sur le long terme. Ton corps mérite mieux que des molécules de synthèse.
    `,
  },
  'guide-hydratation-ete': {
    title: 'Guide de l\'hydratation en été : rester au top par temps chaud',
    excerpt: 'Toutes les astuces pour maintenir une hydratation et un apport protéique optimal quand le thermomètre s\'affole.',
    author: { name: 'Sophie Martin' },
    publishedAt: '1er janvier 2024',
    readTime: '6 min',
    category: 'Entraînement',
    content: `
L'été est une période critique pour les athlètes. La chaleur augmente drastiquement tes besoins en hydratation, tout en rendant la consommation de protéines plus difficile. Voici ton guide complet pour rester performant même quand le thermomètre s'affole.

## Comprendre l'impact de la chaleur

Par temps chaud, ton corps perd beaucoup plus d'eau et d'électrolytes :

- **Sudation augmentée** de 2 à 4 fois par rapport aux températures normales
- **Perte d'électrolytes** (sodium, potassium, magnésium)
- **Température corporelle** plus difficile à réguler
- **Digestion ralentie** – ton corps priorise le refroidissement

## Les besoins en hydratation par temps chaud

**Avant l'effort** : Bois 500ml dans les 2 heures précédant ton entraînement. Ton urine doit être claire.

**Pendant l'effort** : 150-250ml toutes les 15-20 minutes. Au-delà d'une heure, ajoute des électrolytes.

**Après l'effort** : Bois 1.5x le poids perdu pendant la séance. Pèse-toi avant et après pour évaluer.

## Le défi des protéines en été

Par temps chaud, les shakes épais deviennent presque impossibles à avaler. C'est là que la texture légère de Tamarque devient un game-changer :

- **Rafraîchissante** comme une boisson désaltérante
- **Légère** sur l'estomac
- **Hydratante** en plus d'être protéinée
- **Agréable à boire** même après l'effort le plus intense

## Stratégies gagnantes

**1. Le combo hydratation + protéines**
Plutôt que de séparer hydratation et nutrition protéique, combine les deux avec une Tamarque bien fraîche post-entraînement. Tu coches deux cases en une.

**2. La méthode des petites doses**
Par forte chaleur, plusieurs petites prises sont meilleures qu'une grosse quantité d'un coup. Bois par petites gorgées régulières.

**3. L'astuce des glaçons**
Verse ta Tamarque sur des glaçons ou congèle-la partiellement pour une version encore plus rafraîchissante.

**4. Les signes d'alerte**
Apprends à reconnaître la déshydratation : soif intense, urines foncées, fatigue, maux de tête, crampes. À ces premiers signes, hydrate-toi immédiatement.

## Planning type d'une journée chaude

**6h00** - Réveil : 500ml d'eau
**7h00** - Entraînement : 200ml toutes les 15 min
**8h30** - Post-entraînement : 1 Tamarque fraîche
**10h00** - Collation : eau + fruits riches en eau
**12h00** - Déjeuner : évite les repas trop lourds
**15h00** - Collation : eau de coco ou eau citronnée
**17h00** - 2e entraînement si applicable : même protocole
**19h00** - Dîner : aliments riches en eau (salades, soupes froides)
**21h00** - Avant le coucher : 250ml d'eau

## Les erreurs à éviter

❌ Attendre d'avoir soif pour boire
❌ Consommer trop de caféine (diurétique)
❌ Forcer un shake épais quand ton corps le refuse
❌ Négliger les électrolytes sur les longues sorties
❌ S'entraîner aux heures les plus chaudes sans adaptation

**Le mot de la fin** : L'été ne doit pas être synonyme de baisse de performance. Avec une stratégie d'hydratation adaptée et des protéines sous forme rafraîchissante, tu peux maintenir – voire améliorer – tes résultats même par 35°C.
    `,
  },
  'mythes-proteines-demystifies': {
    title: '7 mythes sur les protéines que tu dois arrêter de croire',
    excerpt: 'Les protéines abîment les reins ? Trop de protéines fait grossir ? On démonte les idées reçues.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '28 décembre 2023',
    readTime: '7 min',
    category: 'Nutrition',
    content: `
Les protéines sont entourées de mythes tenaces. Certains datent de plusieurs décennies et continuent de circuler malgré les preuves scientifiques du contraire. Il est temps de démêler le vrai du faux.

## Mythe #1 : "Les protéines abîment les reins"

**La réalité** : Chez les personnes en bonne santé, aucune étude n'a montré d'effet néfaste d'un apport élevé en protéines sur la fonction rénale. Ce mythe vient de recommandations pour les personnes souffrant déjà d'insuffisance rénale, à qui on conseille de limiter les protéines.

Pour un athlète avec des reins en bonne santé, consommer 1.6-2.2g de protéines par kg de poids corporel est parfaitement sûr et même recommandé.

## Mythe #2 : "Trop de protéines fait grossir"

**La réalité** : Les protéines sont le macronutriment le plus rassasiant et celui qui demande le plus d'énergie à digérer (effet thermique). Un excès calorique fait grossir, pas les protéines en elles-mêmes.

En fait, les régimes riches en protéines sont souvent associés à une meilleure gestion du poids grâce à la satiété qu'elles procurent.

## Mythe #3 : "On ne peut absorber que 30g de protéines par repas"

**La réalité** : Ton corps peut absorber bien plus de 30g. Ce qui est vrai, c'est que la synthèse protéique musculaire est maximisée autour de 20-40g par prise. Mais l'excédent n'est pas "gaspillé" – il est utilisé pour d'autres fonctions ou oxydé pour l'énergie.

Répartir ton apport reste une bonne idée pour optimiser la synthèse musculaire, mais tu n'as pas besoin de manger toutes les 3 heures.

## Mythe #4 : "Les protéines végétales sont incomplètes et inutiles"

**La réalité** : Si certaines sources végétales manquent d'un ou deux acides aminés essentiels, la combinaison de différentes sources (légumineuses + céréales par exemple) fournit un profil complet.

Cela dit, pour les athlètes recherchant l'efficacité maximale, la whey reste la référence en termes de biodisponibilité et de profil d'acides aminés.

## Mythe #5 : "Les femmes ne doivent pas prendre autant de protéines"

**La réalité** : Les besoins protéiques dépendent du poids corporel et du niveau d'activité, pas du genre. Une femme de 60kg qui s'entraîne intensément a besoin d'autant de protéines (proportionnellement) qu'un homme dans la même situation.

Le mythe vient de la peur de devenir "trop musclée" – mais les femmes n'ont pas le profil hormonal pour prendre de la masse musculaire comme les hommes sans efforts très spécifiques.

## Mythe #6 : "Il faut consommer des protéines immédiatement après l'entraînement"

**La réalité** : La "fenêtre anabolique" de 30 minutes est exagérée. La synthèse protéique reste élevée pendant 24-48h après l'entraînement.

Cela dit, consommer des protéines dans les 2 heures post-entraînement reste une bonne pratique, surtout si tu t'entraînes à jeun ou si ton prochain repas est loin. C'est juste moins urgent qu'on le croyait.

## Mythe #7 : "Les protéines en poudre sont moins bonnes que les protéines alimentaires"

**La réalité** : L'isolat de whey est l'une des sources de protéines les plus pures et les mieux absorbées qui existent. Elle provient du lait et subit un processus de filtration pour concentrer les protéines.

Les suppléments ne remplacent pas une alimentation équilibrée, mais ils sont un moyen pratique et efficace de compléter tes apports, surtout autour de l'entraînement.

## Le verdict

La science nutritionnelle a beaucoup évolué ces dernières années. Ne laisse pas des mythes datés te priver des bénéfices d'un apport protéique optimisé. Base tes choix sur les preuves, pas sur les "on dit".
    `,
  },
  'routine-matinale-athlete': {
    title: 'La routine matinale parfaite pour les sportifs',
    excerpt: 'Comment démarrer ta journée pour maximiser tes performances.',
    author: { name: 'Sophie Martin' },
    publishedAt: '20 décembre 2023',
    readTime: '5 min',
    category: 'Entraînement',
    content: `
Comment tu commences ta journée influence directement tes performances. Une routine matinale bien construite peut transformer ton énergie, ta concentration et tes résultats à l'entraînement. Voici le guide complet.

## Pourquoi le matin est crucial

Les premières heures après le réveil sont un moment clé :

- **Cortisol naturellement élevé** : profites-en pour des tâches exigeantes
- **Métabolisme à relancer** après le jeûne nocturne
- **Hydratation à restaurer** : tu perds 500ml à 1L d'eau pendant la nuit
- **Habitudes qui s'ancrent** : ce que tu fais le matin devient automatique

## La routine en 5 étapes

**Étape 1 : Hydratation immédiate (5 min)**

Avant même le café, bois 500ml d'eau. Ton corps est déshydraté après 7-8h sans boire. Ajoute un peu de citron si tu veux un boost de vitamine C et d'éveil.

**Étape 2 : Mouvement léger (10 min)**

Pas besoin d'un entraînement complet. Quelques étirements dynamiques, une série de squats au poids du corps, quelques pompes. L'objectif : activer la circulation et réveiller ton corps en douceur.

**Étape 3 : Exposition à la lumière (pendant les étapes précédentes)**

La lumière naturelle du matin régule ton rythme circadien. Ouvre les volets, sors sur le balcon si possible. Ça booste l'éveil et améliore ton sommeil le soir venu.

**Étape 4 : Petit-déjeuner protéiné (15 min)**

C'est là que les protéines entrent en jeu. Un petit-déjeuner riche en protéines :
- Stabilise ta glycémie toute la matinée
- Réduit les fringales de 10h
- Lance la synthèse protéique musculaire
- Améliore la concentration

**Idées de petits-déjeuners protéinés :**
- Œufs + pain complet + avocat
- Yaourt grec + fruits + granola protéiné
- Smoothie avec une Tamarque + banane + beurre de cacahuète
- Pancakes protéinés

**Étape 5 : Intention de la journée (5 min)**

Prends 5 minutes pour visualiser ta journée. Quels sont tes objectifs d'entraînement ? Qu'est-ce qui te motive ? Cette pratique mentale a des effets prouvés sur la performance.

## Pour ceux qui s'entraînent le matin

Si tu t'entraînes tôt, adapte la routine :

**Option 1 : Entraînement à jeun**
- Hydratation dès le réveil
- Entraînement direct
- Petit-déjeuner protéiné post-training (Tamarque + repas solide)

**Option 2 : Petit-déjeuner léger avant**
- Banane + quelques gorgées de Tamarque 30 min avant
- Entraînement
- Compléter le petit-déjeuner après

## Les erreurs du matin à éviter

❌ Scroller son téléphone au réveil (retarde l'activation)
❌ Sauter le petit-déjeuner (surtout si tu t'entraînes)
❌ Trop de café à jeun (acidité, nervosité)
❌ Se presser (stress = cortisol en excès)
❌ Petit-déjeuner trop sucré (crash énergétique à 10h)

## Combien de temps pour créer l'habitude ?

La science parle de 66 jours en moyenne pour ancrer une nouvelle habitude. Commence par une version simplifiée de cette routine et enrichis-la progressivement. L'important est la régularité, pas la perfection.

**À toi de jouer** : Choisis 2-3 éléments de cette routine et intègre-les dès demain matin. Ton corps et tes performances te remercieront.
    `,
  },
  'crossfit-nutrition-guide': {
    title: 'Nutrition pour le CrossFit : le guide ultime',
    excerpt: 'WOD, AMRAP, EMOM... Ta nutrition doit suivre l\'intensité de tes entraînements.',
    author: { name: 'Emma Dubois' },
    publishedAt: '15 décembre 2023',
    readTime: '9 min',
    category: 'Nutrition',
    content: `
Le CrossFit est unique : il combine endurance, force, gymnastique et puissance dans des entraînements de haute intensité. Ta nutrition doit être à la hauteur de cette exigence. Voici le guide complet pour alimenter ta machine.

## Les besoins spécifiques du CrossFitter

Le CrossFit sollicite tous les systèmes énergétiques :

- **Système phosphagène** (efforts explosifs < 10s)
- **Glycolyse anaérobie** (efforts intenses 30s-2min)
- **Système aérobie** (efforts prolongés)

Cette variété signifie que tu as besoin de tous les macronutriments en quantité suffisante.

## Les macros du CrossFitter

**Protéines : 1.6-2.2g par kg de poids corporel**

Le CrossFit détruit du muscle (pour mieux le reconstruire). Tu as besoin d'un apport protéique élevé pour :
- La récupération musculaire
- L'adaptation à l'entraînement
- Le maintien de la masse maigre

**Glucides : 3-5g par kg de poids corporel**

Les glucides sont ton carburant principal pour les WODs. Contrairement aux régimes low-carb à la mode, le CrossFitter a besoin de glycogène pour performer :
- Avant le WOD : pour le carburant
- Après le WOD : pour la récupération

**Lipides : 0.8-1.2g par kg de poids corporel**

Les graisses sont essentielles pour :
- La production hormonale (testostérone, hormones thyroïdiennes)
- L'absorption des vitamines liposolubles
- L'énergie sur les efforts longs

## Timing nutritionnel autour du WOD

**2-3h avant le WOD**
Repas complet équilibré :
- 30-40g protéines
- 50-80g glucides complexes
- 15-20g lipides
- Exemple : Poulet + riz + légumes + huile d'olive

**30-60 min avant le WOD**
Si besoin d'un boost :
- 20-30g glucides simples
- Un peu de protéines
- Exemple : Banane + quelques gorgées de Tamarque

**Pendant le WOD**
Pour les WODs > 20 min ou les compétitions :
- Eau + électrolytes
- Éventuellement quelques gorgées de boisson glucidique

**Immédiatement après le WOD**
C'est le moment clé :
- 20-30g protéines à absorption rapide
- 30-50g glucides
- La combo parfaite : une Tamarque + une banane

**1-2h après le WOD**
Repas complet de récupération :
- Protéines + glucides + légumes
- Exemple : Saumon + patates douces + brocolis

## L'avantage Tamarque pour le CrossFit

Après un WOD intense, la dernière chose dont tu as envie c'est d'un shake épais et lourd. C'est pour ça que les CrossFitters adoptent Tamarque :

✓ **Texture légère** qui passe même après Fran
✓ **20g de protéines** pour la récupération
✓ **Hydratation** simultanée – crucial après la sueur
✓ **Digestion facile** – pas de ballonnements avant le WOD suivant
✓ **Saveurs rafraîchissantes** qui récompensent l'effort

## Hydratation : le facteur sous-estimé

La déshydratation impacte massivement la performance :
- -2% du poids corporel en eau = -10-20% de performance
- Les WODs intenses peuvent faire perdre 1-2L de sueur

**Stratégie :**
- Bois régulièrement tout au long de la journée
- 500ml dans les 2h précédant le WOD
- Électrolytes si WOD > 1h ou forte chaleur

## Spécial compétition

Les jours de compétition, adapte ta stratégie :

- Petit-déjeuner 3h avant le premier WOD
- Snacks facilement digestibles entre les WODs
- Tamarque après chaque WOD pour la récup express
- Évite les aliments nouveaux – reste sur tes habitudes

## Les suppléments utiles pour le CrossFit

Au-delà des protéines, certains suppléments ont fait leurs preuves :

1. **Créatine** (3-5g/jour) : force et puissance
2. **Caféine** (3-6mg/kg) : performance et focus
3. **Oméga-3** : anti-inflammatoire et récupération
4. **Magnésium** : fonction musculaire et sommeil

## Erreurs nutritionnelles courantes

❌ Sous-manger par peur de "grossir"
❌ Éviter les glucides (le CrossFit en a besoin !)
❌ Négliger les protéines autour de l'entraînement
❌ Trop de suppléments, pas assez d'aliments vrais
❌ Oublier l'hydratation

**Le message clé** : Le CrossFit exige beaucoup de ton corps. Donne-lui le carburant qu'il mérite. Une nutrition adaptée transformera tes performances et ta récupération.
    `,
  },
  'recuperation-musculaire-optimale': {
    title: 'Récupération musculaire : les 5 piliers scientifiquement prouvés',
    excerpt: 'Sommeil, nutrition, stretching, froid, repos actif... Tout ce que la science nous apprend sur la récupération optimale.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '10 décembre 2023',
    readTime: '8 min',
    category: 'Santé',
    content: `
La récupération est le pilier oublié de la performance. Tu peux t'entraîner dur, manger bien, mais si tu ne récupères pas correctement, tu stagnes – ou pire, tu régresses. Voici les 5 piliers de la récupération musculaire validés par la science.

## Pilier #1 : Le sommeil – le roi de la récupération

Pendant le sommeil profond, ton corps sécrète jusqu'à 70% de son hormone de croissance quotidienne. Cette hormone est directement responsable de la réparation et de la croissance musculaire.

**Les recommandations :**
- 7 à 9 heures par nuit pour les athlètes
- Couche-toi et lève-toi à heures fixes
- Chambre fraîche (18-20°C), sombre et silencieuse
- Évite les écrans 1h avant le coucher

**Le hack** : Une sieste de 20-30 minutes en début d'après-midi peut compenser un déficit de sommeil nocturne.

## Pilier #2 : La nutrition post-entraînement

Les premières heures après l'entraînement sont cruciales pour la récupération. Ton corps est en mode "reconstruction" et a besoin des bons matériaux.

**Protéines** : 20-40g dans les 2 heures post-entraînement. C'est là qu'une Tamarque est parfaite – légère et digeste, même après l'effort le plus intense.

**Glucides** : Reconstituent les réserves de glycogène. 0.5-1g par kg de poids corporel.

**Hydratation** : Bois 1.5x le poids perdu pendant l'entraînement.

## Pilier #3 : La récupération active

Le repos total n'est pas toujours la meilleure option. La récupération active accélère l'élimination des déchets métaboliques et maintient la mobilité.

**Exemples de récupération active :**
- Marche légère (20-30 min)
- Natation douce
- Yoga ou stretching dynamique
- Vélo à faible intensité

**L'idéal** : 20-30 minutes à une intensité très basse (tu dois pouvoir tenir une conversation facilement).

## Pilier #4 : Les techniques de contraste thermique

L'alternance chaud/froid stimule la circulation sanguine et accélère l'élimination des déchets métaboliques.

**Protocole douche contrastée :**
- 2 min eau chaude
- 30 sec eau froide
- Répéter 3-4 fois
- Terminer par le froid

**Bain de glace** : 10-15 minutes à 10-15°C. Efficace mais intense – pas pour tout le monde.

## Pilier #5 : La gestion du stress

Le stress chronique élève le cortisol, une hormone catabolique qui freine la récupération et favorise le stockage de graisse.

**Techniques anti-stress :**
- Méditation (même 5 min/jour fait une différence)
- Respiration profonde (technique 4-7-8)
- Temps en nature
- Déconnexion des écrans

## Les erreurs qui sabotent ta récupération

❌ **S'entraîner tous les jours à haute intensité** : Ton corps a besoin de jours off ou légers.

❌ **Négliger les protéines au petit-déjeuner** : Tu sors d'un jeûne de 8h, ton corps a besoin de matériaux de construction.

❌ **Sous-estimer le sommeil** : "Je dormirai quand je serai mort" est la pire mentalité pour un athlète.

❌ **Boire de l'alcool après l'entraînement** : L'alcool interfère avec la synthèse protéique pendant 24-48h.

## Ton plan de récupération optimale

**Immédiatement après l'entraînement :**
- Hydratation + Tamarque (20g protéines)
- Stretching léger (5-10 min)

**Dans les 2 heures :**
- Repas complet (protéines + glucides + légumes)

**Le soir :**
- Douche contrastée si nécessaire
- Routine de relaxation
- Coucher à heure fixe

**Le message clé** : La récupération n'est pas une option, c'est un pilier non négociable de la performance. Investis autant dans ta récupération que dans ton entraînement.
    `,
  },
  'whey-isolate-vs-concentrate': {
    title: 'Whey Isolate vs Concentrate : quelle protéine choisir ?',
    excerpt: 'Décryptage des différences entre isolat et concentrat de whey. Absorption, pureté, digestibilité... On te dit tout.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '5 décembre 2023',
    readTime: '6 min',
    category: 'Nutrition',
    content: `
Tu as sûrement vu ces termes sur les pots de protéines : "Whey Concentrate", "Whey Isolate", parfois même "Whey Hydrolysate". Mais qu'est-ce que ça change concrètement ? On décrypte.

## D'où vient la whey ?

La whey (ou lactosérum) est le liquide qui reste après la fabrication du fromage. Ce "petit-lait" contient des protéines de très haute qualité avec un profil d'acides aminés complet.

## Whey Concentrate (WPC)

**Ce que c'est** : La forme la moins transformée de whey. Filtration simple qui conserve une partie des graisses et du lactose.

**Composition typique** :
- 70-80% de protéines
- 5-8% de graisses
- 4-8% de lactose

**Avantages** :
- Prix plus accessible
- Goût souvent plus crémeux
- Conserve certains composés bioactifs

**Inconvénients** :
- Moins de protéines par dose
- Peut causer des problèmes digestifs (lactose)
- Absorption un peu plus lente

## Whey Isolate (WPI)

**Ce que c'est** : Whey qui a subi une filtration supplémentaire pour éliminer presque toutes les graisses et le lactose.

**Composition typique** :
- 90-95% de protéines
- < 1% de graisses
- < 1% de lactose

**Avantages** :
- Plus de protéines par dose
- Quasi sans lactose (convient aux intolérants légers)
- Absorption rapide
- Moins de calories à quantité de protéines égale

**Inconvénients** :
- Prix plus élevé
- Goût parfois plus "sec"

## Chez Tamarque, on a choisi l'Isolate. Pourquoi ?

Notre formule utilise exclusivement de la whey isolate pour plusieurs raisons :

**Texture légère** : Avec moins de graisses, notre boisson reste légère et rafraîchissante, pas crémeuse et lourde.

**Digestibilité** : Le quasi-zéro lactose signifie que même les personnes sensibles peuvent la consommer sans inconfort.

**Pureté** : Chaque bouteille délivre 20g de protéines pures, sans "remplissage" de graisses ou de sucres.

**Absorption rapide** : Idéal en post-entraînement quand tes muscles ont besoin de protéines rapidement.

## Quand choisir le Concentrate ?

Le concentrate reste un bon choix si :
- Tu as un budget serré
- Tu digères bien le lactose
- Tu cherches un shake plus crémeux pour le petit-déjeuner

## Quand choisir l'Isolate ?

L'isolate est préférable si :
- Tu es intolérant au lactose
- Tu veux maximiser les protéines par calorie
- Tu préfères une texture légère
- Tu le consommes autour de l'entraînement

## Le mythe de l'hydrolysate

Tu verras parfois "Whey Hydrolysate" vendue comme la forme "ultime". En réalité, les études ne montrent pas de différence significative d'absorption avec l'isolate pour la plupart des gens – mais le prix est souvent beaucoup plus élevé.

## En résumé

| Critère | Concentrate | Isolate |
|---------|-------------|---------|
| Protéines | 70-80% | 90-95% |
| Lactose | 4-8% | < 1% |
| Prix | €€ | €€€ |
| Digestion | Variable | Excellente |
| Absorption | Rapide | Très rapide |

**Notre conseil** : Si tu peux te le permettre et que tu valorises la pureté et la digestibilité, l'isolate est le choix premium. C'est celui qu'on a fait pour Tamarque.
    `,
  },
  'sport-voyage-conseils': {
    title: 'Comment maintenir ton entraînement en voyage',
    excerpt: 'Déplacements pro, vacances... Pas de panique ! Voici comment rester actif et bien nourri même loin de chez toi.',
    author: { name: 'Sophie Martin' },
    publishedAt: '28 novembre 2023',
    readTime: '5 min',
    category: 'Entraînement',
    content: `
Voyage d'affaires, vacances, week-end chez des amis... Les déplacements sont souvent perçus comme des "pauses" forcées dans la routine fitness. Mais avec la bonne stratégie, tu peux rester actif et bien nourri partout.

## Changer de mindset

Premier point : oublie l'idée de maintenir ton programme à 100%. L'objectif en voyage, c'est de maintenir un minimum d'activité et de bonnes habitudes nutritionnelles – pas de battre tes PR.

## Entraînements sans matériel

Tu n'as pas besoin de salle pour t'entraîner efficacement. Voici des routines qui fonctionnent partout :

**Circuit full body (20 min)**
- 10 squats
- 10 pompes
- 10 fentes alternées
- 10 mountain climbers
- Planche 30 sec
- Répéter 4 fois

**Tabata bodyweight (4 min)**
- 20 sec burpees
- 10 sec repos
- 20 sec squats sautés
- 10 sec repos
- Répéter 4 fois

**Yoga matinal (15 min)**
- Salutations au soleil
- Étirements des hanches
- Torsions vertébrales
- Excellent pour contrebalancer les heures assises en avion/train

## Nutrition en déplacement

C'est souvent le plus grand défi. Voici comment gérer :

**Protéines transportables**
- Les bouteilles Tamarque sont parfaites pour le voyage : compactes, prêtes à boire, elles se glissent facilement dans ton sac
- Sachets de noix/amandes
- Barres protéinées (choisis celles sans sucres ajoutés)

**Restaurant : les bons choix**
- Protéine grillée + légumes + féculent nature
- Évite les sauces et fritures
- Demande l'assaisonnement à part

**Petit-déjeuner d'hôtel**
- Œufs (sous toutes leurs formes)
- Yaourt nature
- Fruits frais
- Évite les viennoiseries et céréales sucrées

## L'hydratation en voyage

L'avion déshydrate énormément (humidité de 10-20% en cabine). Bois plus que d'habitude :
- 250ml par heure de vol
- Évite l'alcool en avion
- Emporte une bouteille vide à remplir après la sécurité

## Gérer le décalage horaire

Le jet lag affecte directement tes performances et ta récupération.

**Stratégies :**
- Adapte-toi à l'heure locale dès l'arrivée
- Expose-toi à la lumière du jour
- Entraîne-toi le matin pour "resetter" ton horloge
- Évite la caféine après 14h (heure locale)

## Kit de voyage fitness

Ce que j'emporte toujours :
- Élastique de résistance (léger, ne prend pas de place)
- 2-3 Tamarque pour les protéines post-training
- Chaussures de sport légères
- Tenue d'entraînement compacte

## Les erreurs à éviter

❌ **Tout ou rien** : "Si je ne peux pas faire ma séance habituelle, je ne fais rien." Même 15 minutes, c'est mieux que zéro.

❌ **Culpabiliser** : Les vacances sont faites pour se reposer aussi. Un burger ou une glace ne vont pas ruiner 6 mois de travail.

❌ **Sauter les protéines** : C'est souvent le macro qu'on néglige le plus en voyage. Assure-toi d'en avoir à chaque repas.

## L'essentiel

Voyager n'est pas une excuse pour abandonner tes habitudes – c'est une opportunité de tester ta flexibilité et ta discipline. Avec un peu de préparation, tu peux revenir sans avoir perdu de terrain, voire avec une nouvelle énergie.
    `,
  },
  'booster-systeme-immunitaire-sport': {
    title: 'Comment le sport renforce ton système immunitaire',
    excerpt: 'L\'activité physique module ton immunité. Mais attention au surentraînement ! On t\'explique le juste équilibre.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '20 novembre 2023',
    readTime: '7 min',
    category: 'Santé',
    content: `
Tu as sûrement remarqué : les sportifs réguliers tombent moins souvent malades que les sédentaires. Ce n'est pas un hasard. L'exercice physique module directement le système immunitaire. Mais attention, il y a un équilibre à respecter.

## La courbe en J de l'immunité

Les chercheurs ont identifié une relation en forme de J entre l'exercice et l'immunité :

- **Sédentaires** : Immunité de base
- **Exercice modéré régulier** : Immunité renforcée (le sweet spot)
- **Surentraînement** : Immunité affaiblie (la "fenêtre ouverte")

## Comment l'exercice booste l'immunité

**Circulation des cellules immunitaires** : L'exercice augmente le flux sanguin, ce qui permet aux cellules immunitaires de circuler plus efficacement dans tout le corps.

**Réduction du stress chronique** : Le sport régulier diminue le cortisol chronique, une hormone qui supprime l'immunité quand elle est élevée en permanence.

**Inflammation contrôlée** : L'exercice crée une inflammation aiguë suivie d'une résolution anti-inflammatoire. Ce processus "entraîne" le système immunitaire.

**Amélioration du sommeil** : Un meilleur sommeil = une meilleure régénération immunitaire nocturne.

## La fenêtre ouverte post-entraînement

Après un effort intense, il y a une période de 3 à 72 heures où le système immunitaire est temporairement affaibli. C'est la "fenêtre ouverte" où le risque d'infection augmente.

**Comment la minimiser :**
- Récupération nutritionnelle immédiate (protéines + glucides)
- Éviter les environnements à risque juste après l'effort
- Bien dormir
- Ne pas enchaîner les séances intenses

## Les signes du surentraînement immunologique

Si tu observes ces symptômes, ton système immunitaire te demande du repos :

- Rhumes à répétition
- Cicatrisation lente des petites blessures
- Fatigue persistante malgré le repos
- Ganglions sensibles
- Herpès labial récurrent

## Le protocole immunité pour sportifs

**Nutrition**
- 20-30g de protéines à chaque repas principal
- Fruits et légumes variés (antioxydants)
- Zinc (viande, fruits de mer, légumineuses)
- Vitamine D (soleil ou supplémentation)

**Entraînement**
- Respecter les jours de repos
- Éviter l'intensité maximale quand tu te sens "limite"
- Périodiser ta charge d'entraînement

**Hygiène de vie**
- 7-9 heures de sommeil
- Gérer le stress
- Éviter l'excès d'alcool

## Le rôle des protéines dans l'immunité

On n'y pense pas souvent, mais les protéines sont essentielles pour l'immunité. Les anticorps sont des protéines ! Un déficit protéique compromet directement la capacité de ton corps à se défendre.

C'est pourquoi maintenir un apport protéique suffisant – via l'alimentation et des compléments comme Tamarque – contribue aussi à ta résistance aux infections.

## En période de maladie : s'entraîner ou pas ?

La règle du cou :
- **Symptômes au-dessus du cou** (nez bouché, gorge irritée) : entraînement léger possible
- **Symptômes en-dessous du cou** (fièvre, courbatures, toux grasse) : repos total

**Important** : Ne jamais s'entraîner avec de la fièvre. Les risques cardiaques sont réels.

## Le message clé

Le sport est un puissant modulateur immunitaire – dans les deux sens. L'exercice régulier à intensité modérée te rend plus résistant. Mais le surentraînement chronique fait l'inverse. Trouve ton équilibre, écoute ton corps, et ta santé globale en bénéficiera.
    `,
  },
  'preparation-mentale-competition': {
    title: 'Préparation mentale : performer le jour J',
    excerpt: 'Visualisation, routines, gestion du stress... Les techniques des champions pour être au top en compétition.',
    author: { name: 'Emma Dubois' },
    publishedAt: '15 novembre 2023',
    readTime: '6 min',
    category: 'Entraînement',
    content: `
Tu peux avoir la meilleure condition physique, si ta tête ne suit pas le jour J, tes performances en souffriront. La préparation mentale n'est pas un luxe réservé aux pros – c'est un outil que tout athlète devrait maîtriser.

## Pourquoi le mental fait la différence

En compétition, le stress active le système nerveux sympathique : accélération cardiaque, tension musculaire, respiration superficielle. À petite dose, c'est bénéfique (arousal optimal). En excès, ça détruit la performance.

Les athlètes qui excellent sous pression ont appris à réguler cette réponse au stress.

## Technique #1 : La visualisation

La visualisation consiste à se représenter mentalement une performance réussie, avec le maximum de détails sensoriels.

**Comment pratiquer :**
1. Trouve un endroit calme
2. Ferme les yeux
3. Visualise ta performance idéale du début à la fin
4. Inclus les sensations physiques, les sons, les émotions
5. Termine par la réussite et les émotions positives associées

**Quand** : 5-10 minutes par jour dans les semaines précédant la compétition. Et juste avant le départ.

## Technique #2 : Les routines pré-performance

Les routines créent un sentiment de contrôle et de familiarité dans un environnement potentiellement stressant.

**Exemples de routines :**
- Même échauffement à chaque fois
- Même playlist musicale
- Mêmes aliments au petit-déjeuner
- Même séquence de gestes avant le départ

L'important n'est pas le contenu de la routine, mais sa constance.

## Technique #3 : La respiration tactique

La respiration est le seul levier direct sur ton système nerveux autonome.

**Technique 4-7-8 :**
- Inspire par le nez pendant 4 secondes
- Retiens pendant 7 secondes
- Expire par la bouche pendant 8 secondes
- Répéter 4 fois

**Respiration carrée :**
- Inspire 4 secondes
- Retiens 4 secondes
- Expire 4 secondes
- Retiens 4 secondes

## Technique #4 : Le dialogue interne

Ce que tu te dis à toi-même influence directement ta performance.

**Remplace :**
- "J'espère ne pas rater" → "Je suis prêt pour réussir"
- "Les autres sont plus forts" → "Je me concentre sur ma course"
- "Et si je rate ?" → "Je fais de mon mieux, c'est suffisant"

**Mots déclencheurs** : Choisis 2-3 mots qui t'ancrent dans ton état optimal. "Calme", "Puissant", "Fluide"... Utilise-les dans ta routine.

## Technique #5 : Le focus attentionnel

Dirige ton attention sur ce que tu peux contrôler :

✅ Ta respiration
✅ Ta technique
✅ Ton effort
✅ Ton attitude

❌ Ce que font les autres
❌ Le résultat final
❌ Ce que les gens pensent

## Gérer l'avant-compétition

**La veille :**
- Pas de changement radical (alimentation, équipement)
- Visualisation et relaxation
- Coucher à heure habituelle

**Le matin :**
- Réveil suffisamment tôt pour ne pas être pressé
- Petit-déjeuner habituel (une Tamarque peut compléter si tu n'as pas faim)
- Routine d'échauffement familière

**Juste avant :**
- Respiration tactique
- Mots déclencheurs
- Focus sur les premières secondes/minutes

## Après la compétition

Le mental se travaille aussi après l'événement :

**Débriefing constructif :**
- Qu'est-ce qui a bien fonctionné ?
- Qu'est-ce que je peux améliorer ?
- Sans jugement, juste des observations

**Célébrer** : Quel que soit le résultat, reconnais l'effort fourni.

## Le message clé

La préparation mentale n'est pas du "blabla" new age. C'est une compétence qui se travaille comme le cardio ou la force. Les techniques présentées ici sont utilisées par les athlètes olympiques et les forces spéciales. Intègre-les à ton entraînement et observe la différence le jour J.
    `,
  },
  'alimentation-anti-inflammatoire': {
    title: 'L\'alimentation anti-inflammatoire pour les sportifs',
    excerpt: 'Réduire l\'inflammation chronique pour mieux récupérer et performer. Les aliments à privilégier et ceux à éviter.',
    author: { name: 'Dr. Lucas Bernard' },
    publishedAt: '10 novembre 2023',
    readTime: '8 min',
    category: 'Nutrition',
    content: `
L'inflammation, c'est le couteau à double tranchant du sportif. L'inflammation aiguë après l'entraînement est nécessaire pour l'adaptation. L'inflammation chronique, en revanche, freine la récupération et augmente le risque de blessure.

## Inflammation aiguë vs chronique

**Inflammation aiguë** : Réponse normale à l'exercice. Rougeur, chaleur, gonflement temporaires. Déclenche les processus de réparation et d'adaptation.

**Inflammation chronique** : État inflammatoire de bas niveau permanent. Invisible mais délétère. Freine la récupération, favorise le catabolisme, augmente la fatigue.

## Les marqueurs de l'inflammation chronique

Comment savoir si tu es en inflammation chronique ?

- Fatigue persistante
- Récupération lente entre les séances
- Douleurs articulaires diffuses
- Sommeil non réparateur
- Infections fréquentes

Un bilan sanguin peut mesurer la CRP (protéine C-réactive), un marqueur d'inflammation.

## Les aliments pro-inflammatoires

**À limiter drastiquement :**

**Sucres raffinés et ultra-transformés**
- Sodas, bonbons, pâtisseries industrielles
- Pic glycémique → réponse inflammatoire

**Huiles végétales riches en oméga-6**
- Huile de tournesol, de maïs, de soja
- Déséquilibre oméga-6/oméga-3 → inflammation

**Aliments ultra-transformés**
- Additifs, conservateurs, exhausteurs de goût
- Le corps ne reconnaît pas ces molécules → réaction inflammatoire

**Excès d'alcool**
- Perturbe la barrière intestinale
- Libère des toxines inflammatoires

**Graisses trans**
- Margarines hydrogénées, fritures industrielles
- Directement pro-inflammatoires

## Les aliments anti-inflammatoires

**Poissons gras** (2-3 fois/semaine)
- Saumon, maquereau, sardines
- Riches en oméga-3 EPA et DHA

**Légumes colorés** (à chaque repas)
- Verts : épinards, brocoli, chou kale
- Rouges/oranges : tomates, carottes, poivrons
- Violets : aubergines, betteraves

**Fruits à faible index glycémique**
- Baies (myrtilles, framboises, mûres)
- Cerises
- Agrumes

**Épices et herbes**
- Curcuma (avec poivre noir pour l'absorption)
- Gingembre
- Romarin, thym, origan

**Graisses saines**
- Huile d'olive extra vierge
- Avocats
- Noix et graines

**Thé vert**
- Catéchines anti-inflammatoires
- 2-3 tasses par jour

## Le protocole anti-inflammatoire

**Petit-déjeuner**
Œufs + avocat + légumes verts + thé vert

**Collation**
Tamarque (protéines pures, zéro additif inflammatoire) + poignée de noix

**Déjeuner**
Poisson gras + légumes variés + huile d'olive + riz complet

**Collation post-training**
Tamarque + fruits rouges

**Dîner**
Poulet/dinde + légumes rôtis + patate douce + épices (curcuma, gingembre)

## Le rôle des protéines de qualité

Les protéines sont essentielles pour la réparation tissulaire, mais leur source compte. Les protéines ultra-transformées (certaines poudres bas de gamme) peuvent contenir des additifs pro-inflammatoires.

Chez Tamarque, on utilise uniquement de l'isolat de whey pur et des arômes naturels – zéro ingrédient susceptible de créer de l'inflammation.

## Les suppléments anti-inflammatoires

Si ton alimentation est déjà optimisée, certains suppléments peuvent aider :

- **Oméga-3** : 2-3g par jour d'EPA+DHA
- **Curcumine** : 500-1000mg avec pipérine
- **Vitamine D** : Selon ton statut (bilan sanguin recommandé)
- **Magnésium** : 300-400mg (glycinate ou citrate)

## Les erreurs courantes

❌ **Prendre des AINS après chaque entraînement** : L'ibuprofène systématique bloque l'adaptation musculaire.

❌ **Régime trop restrictif** : Le stress de la restriction est aussi inflammatoire.

❌ **Oublier le sommeil** : Le manque de sommeil est hautement inflammatoire.

## Le message clé

L'alimentation anti-inflammatoire n'est pas un régime à la mode – c'est une approche scientifique de la nutrition qui optimise ta récupération et ta longévité sportive. Les changements ne sont pas spectaculaires du jour au lendemain, mais sur plusieurs mois, la différence est notable.
    `,
  },
  'femmes-musculation-guide': {
    title: 'Musculation au féminin : le guide sans complexe',
    excerpt: 'Non, tu ne vas pas devenir une montagne de muscles. On démonte les mythes et on te donne les clés pour progresser.',
    author: { name: 'Sophie Martin' },
    publishedAt: '5 novembre 2023',
    readTime: '7 min',
    category: 'Entraînement',
    content: `
"Je ne veux pas ressembler à un homme." "Je vais devenir trop musclée." "Les poids, c'est pas pour moi." Si tu as déjà pensé ça, ce guide est pour toi. La musculation au féminin est entourée de mythes qu'il est temps de pulvériser.

## Le mythe du "trop musclée"

Commençons par le plus répandu : la peur de devenir une montagne de muscles.

**La réalité physiologique** : Les femmes ont 15 à 20 fois moins de testostérone que les hommes. Cette hormone est le principal moteur de l'hypertrophie musculaire. Sans elle (et sans des années d'entraînement intensif + parfois des aides chimiques), devenir "massive" est physiologiquement impossible.

Ce que la musculation t'apportera : un corps tonique, des courbes fermes, une meilleure posture. Pas des épaules de rugbyman.

## Les vrais bénéfices pour les femmes

**Métabolisme boosté** : Plus de muscle = plus de calories brûlées au repos. La musculation est plus efficace que le cardio pour la gestion du poids à long terme.

**Santé osseuse** : Les femmes sont plus à risque d'ostéoporose. L'entraînement en résistance augmente la densité osseuse.

**Confiance en soi** : Soulever des poids, progresser, se sentir forte – ça transforme le rapport à son corps.

**Équilibre hormonal** : L'exercice en résistance aide à réguler les hormones, y compris pendant et après la ménopause.

## Comment s'entraîner

**Exercices de base à maîtriser :**
- Squat (cuisses, fessiers)
- Hip thrust (fessiers)
- Soulevé de terre (chaîne postérieure)
- Développé couché (pectoraux, triceps)
- Rowing (dos, biceps)
- Overhead press (épaules)

**Fréquence recommandée :**
- 3-4 séances par semaine
- Chaque groupe musculaire travaillé 2 fois par semaine
- Repos suffisant entre les séances

**Progression :**
Augmente graduellement les charges. C'est la surcharge progressive qui crée les résultats, pas le nombre de répétitions avec des poids plume.

## La nutrition adaptée

Les femmes ont souvent peur de "trop manger" ou de prendre des protéines. Grosse erreur.

**Besoins protéiques :**
- 1.6-2g par kg de poids corporel pour les femmes qui s'entraînent
- Répartis sur 3-4 repas
- Les protéines ne font pas "gonfler" – elles construisent et maintiennent le muscle

**Calories :**
- Ne pas sous-manger ! Un déficit trop important = perte de muscle et métabolisme ralenti
- Vise un léger surplus ou maintenance pour construire du muscle
- Le "manger moins, bouger plus" est simpliste et contre-productif

**Tamarque et musculation féminine :**
Nos boissons sont parfaites pour les femmes : 20g de protéines, légères, sans sensation de lourdeur. Idéales en post-training ou en collation.

## Le cycle menstruel et l'entraînement

Ton cycle influence tes performances. Apprends à l'utiliser :

**Phase folliculaire (jours 1-14)**
- Œstrogènes en hausse
- Meilleure tolérance à l'intensité
- Bon moment pour les gros mouvements et les PR

**Phase lutéale (jours 15-28)**
- Progestérone dominante
- Température corporelle plus élevée
- Possible fatigue accrue
- Adapte l'intensité si nécessaire

**Règles** : Tu peux t'entraîner si tu te sens bien. L'exercice peut même soulager les crampes.

## Les erreurs à éviter

❌ **Se limiter au cardio** : Les heures de tapis de course ne sculpteront jamais ton corps comme la musculation.

❌ **Utiliser des poids trop légers** : Si tu peux faire 20 reps facilement, c'est trop léger.

❌ **Avoir peur de manger** : L'undereating est l'ennemi de la construction musculaire.

❌ **Se comparer sur Instagram** : Les photos sont souvent retouchées, les poses optimisées, les athlètes parfois "aidées".

❌ **Négliger les protéines** : "Je ne veux pas de poudre, c'est pas naturel." L'isolat de whey est simplement du lait filtré.

## Programme débutante

**Séance A** (lundi/jeudi)
- Squat : 3x10
- Hip thrust : 3x12
- Fentes : 3x10/jambe
- Extension mollets : 3x15

**Séance B** (mardi/vendredi)
- Développé couché : 3x10
- Rowing haltères : 3x10
- Overhead press : 3x10
- Curl biceps : 2x12
- Dips triceps : 2x12

## Le message clé

La musculation est l'un des meilleurs cadeaux que tu puisses faire à ton corps. Oublie les clichés, ose soulever lourd, nourris-toi correctement. Tu ne deviendras pas "trop musclée" – tu deviendras forte, confiante et en pleine santé.
    `,
  },
};

// Convert BlogPost to display format
function formatBlogPost(post: BlogPost): {
  title: string;
  excerpt: string;
  author: { name: string };
  publishedAt: string;
  readTime: string;
  category: string;
  content: string;
} {
  return {
    title: post.title,
    excerpt: post.excerpt,
    author: { name: post.author.name },
    publishedAt: new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    readTime: '5 min read',
    category: post.tags[0] || 'Article',
    content: post.body,
  };
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<{
    title: string;
    excerpt: string;
    author: { name: string };
    publishedAt: string;
    readTime: string;
    category: string;
    content: string;
  } | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      try {
        // Try to fetch from Sanity first
        const sanityPost = await getPostBySlug(slug);
        if (sanityPost) {
          setPost(formatBlogPost(sanityPost));
          // Fetch related posts
          const related = await getRelatedPosts(slug, sanityPost.tags, 3);
          setRelatedPosts(related);
        } else {
          // Fall back to mock data
          const mockPost = MOCK_BLOG_POSTS[slug];
          if (mockPost) {
            setPost(mockPost);
          } else {
            setPost(null);
          }
          setRelatedPosts([]);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        // Fall back to mock data on error
        const mockPost = MOCK_BLOG_POSTS[slug];
        if (mockPost) {
          setPost(mockPost);
        } else {
          setPost(null);
        }
        setRelatedPosts([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article introuvable</h1>
            <Link href="/blog" className="text-[#FF6B35] hover:underline">
              Retour au blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get related posts from mock if no Sanity related posts
  const displayRelatedPosts = relatedPosts.length > 0
    ? relatedPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.tags[0] || 'Article',
      }))
    : Object.entries(MOCK_BLOG_POSTS)
        .filter(([key]) => key !== slug)
        .slice(0, 3)
        .map(([key, p]) => ({
          slug: key,
          title: p.title,
          category: p.category,
        }));

  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-[#FF6B35]">Accueil</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-[#FF6B35]">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.category}</span>
          </nav>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <span className="inline-block px-3 py-1 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{post.author.name}</div>
                <div className="text-sm text-gray-500">
                  {post.publishedAt} • {post.readTime}
                </div>
              </div>
            </div>
          </motion.header>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="aspect-video bg-gradient-to-br from-[#FF6B35]/20 to-[#FF1493]/20 rounded-3xl mb-12 flex items-center justify-center"
          >
            <div className="text-6xl">
              {post.category === 'Recettes' && '🍹'}
              {post.category === 'Nutrition' && '🥗'}
              {post.category === 'Entraînement' && '🏃'}
              {post.category === 'Innovation' && '💡'}
              {post.category === 'Santé' && '💪'}
              {!['Recettes', 'Nutrition', 'Entraînement', 'Innovation', 'Santé'].includes(post.category) && '📝'}
            </div>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none"
          >
            {post.content.split('\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="text-2xl font-bold mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <p key={i} className="font-semibold mt-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              }
              if (paragraph.match(/^\d\./)) {
                return (
                  <p key={i} className="ml-4 my-2">
                    {paragraph}
                  </p>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={i} className="my-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 bg-gradient-to-br from-[#FF6B35] to-[#FF1493] text-white rounded-3xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Prêt à tester Tamarque ?</h3>
            <p className="text-white/80 mb-6">
              Découvre la protéine nouvelle génération. 20g de protéines, 100% naturel, zéro ballonnements.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-[#FF6B35] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Découvrir la boutique
            </Link>
          </motion.div>

          {/* Share */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Partager cet article</span>
              <div className="flex gap-4">
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        <section className="bg-gray-50 py-16 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Articles similaires</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {displayRelatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-3xl">
                      {relatedPost.category === 'Recettes' && '🍹'}
                      {relatedPost.category === 'Nutrition' && '🥗'}
                      {relatedPost.category === 'Entraînement' && '🏃'}
                      {relatedPost.category === 'Innovation' && '💡'}
                      {relatedPost.category === 'Santé' && '💪'}
                      {!['Recettes', 'Nutrition', 'Entraînement', 'Innovation', 'Santé'].includes(relatedPost.category) && '📝'}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-[#FF6B35] font-medium">{relatedPost.category}</span>
                    <h3 className="font-bold mt-2 group-hover:text-[#FF6B35] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

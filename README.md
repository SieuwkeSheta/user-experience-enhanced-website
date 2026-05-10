# Snappthis - Design Challenge - Data ophalen uit database
In sprint 8 hebben we de opdracht gekregen om een website/webapplicatie te ontwikkelen voor een opdrachtgever, samen met meerdere 1e jaars FDND-studenten. Tijdens deze derde sprint (sprint 10) heb ik mij gericht op het POST'en van hartjes(likes), tomaten(dislikes) en sterren(favorites) op de snapp detailpaginas. De interacties worden bijgehouden in de [FDND Directus Database - Snappthis](https://fdnd-agency.directus.app/items/snappthis_action?fields=*,snap.snapmap.*,uuid.*) Ik heb gebruik gemaakt van NodeJS, Express, JSON en Liquid.

#### Wat is Snappthis?
Snappthis is een mobiele webapplicatie waarmee gebruikers foto's delen binnen
zogenoemde snappmaps. Een gebruiker wordt uitgenodigd in een groep; die groep kan
meerdere snappmaps bevatten. Een begeleider, bijvoorbeeld een docent, maakt een
snappmap aan en geeft deze een thema of opdracht. Deelnemers delen hierin zelfgemaakte
foto's, die dienen als inspiratie- en gespreksonderwerp vanuit de echte wereld.

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Gebruik](#gebruik)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)


## Beschrijving
Voor het verder ontwikkelen van de website/webapplicatie heb ik mij deze derde sprint (sprint 10) gericht op het POST'en van hartjes(likes), tomaten(dislikes) en sterren(favorites) op de snapp detailpaginas. Aan de hand van [ontwerpen van de opdrachtgever](https://www.figma.com/design/0sXvjvqboOmfDuFMUcRHJh/2025snappthisDesign?node-id=0-1&t=wNnupeKFPlzL0bBO-1) heb ik in een [issue](https://github.com/SieuwkeSheta/user-experience-enhanced-website/issues/11) het ontwerp procces gedocumenteerd. Ik heb eerst een User story gemaakt om de 'User Generated Content' te onderzoeken. Daarna heb ik [Wireflows/ Screenflows](https://github.com/SieuwkeSheta/user-experience-enhanced-website/issues/12) gemaakt van elke interactie. Vanuit de wireflows/ screenflows heb ik [breakdown schetsen](https://github.com/SieuwkeSheta/user-experience-enhanced-website/issues/11?issue=SieuwkeSheta%7Cuser-experience-enhanced-website%7C13) gemaakt om te onderzoeken welke code ik nodig zou hebben. 
<br>Tijdens deze sprint heb ik ook [een UI 'loading state'](https://github.com/SieuwkeSheta/user-experience-enhanced-website/issues/10), per interactie, met client side JS ontworpen.

Link naar website: https://user-experience-enhanced-website-1-kzao.onrender.com/snappmaps/test

<img width="150" alt="image" src="https://github.com/user-attachments/assets/9bafd3ac-6967-462f-a5eb-4cb12b3dd246" />

> _Mockup van de Snappthis detailpagina_

## Gebruik
Als gebruiker wil je kunnen liken of tomaten geven, daarnaast een ster kunnen geven, om een reactie te geven aan een Snapp.

<img width="500" alt="Image" src="https://github.com/user-attachments/assets/0d853812-cc19-404b-b5bf-f10f2a7259b8" />

>_[Wireflow](https://github.com/SieuwkeSheta/user-experience-enhanced-website/issues/12) van de like en unlike interactie_

<br>

<img width="500" alt="Image" src="https://github.com/user-attachments/assets/c81c8ec0-b4f2-49ca-94f0-e2373b3170ef" />

>_[Wireflow](https://github.com/SieuwkeSheta/user-experience-enhanced-website/issues/15) van de client side JS 'like'-loading state_

<br>De interactie van het liken, disliken en favorites toevoegen is geïmplementeerd. De UI 'loading state' is nog in ontwikkeling.
<br>

https://github.com/user-attachments/assets/307a7317-a1a6-476a-96a9-cd7da3c23d96


## Kenmerken
Ik heb gebruik gemaakt van HTML, CSS, JS, NodeJS, Express, JSON en Liquid.

**POST**
<br> Voor het POST'en van een like, dislike en favorite wordt er een [formulier](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/views/partials/head.liquid#L107-L140) met data van elke '<button type="submit">' doorgestuurd naar de database. Vervolgens wordt er gekeken of [een specifiek persoon](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L206) al een interactie heeft gedaan op [een specifieke Snapp](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L205) en zo ja [welke](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L220-L287). 
- Als er al een like is gegeven, dan wordt de like verwijderd.
- Als er al een dislike is gegeven, dan wordt de dislike verwijderd.
- Als er al een favorieten is toegevoegd, dan wordt de favoriten verwijderd.
- Als het geliked is en iemand wil een dislike geven, dan wordt het omgewisseld.

**GET**
<br>Voor het ophalen van de data uit de database, wordt er een 'GET'-request gedaan met gefilterde data van de [likes](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L176-L178), [dislikes](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L180-L182) en [favorites](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L184-L186). De opgehaalde data wordt dan in een Liquid view gerenderd en de objecten worden bij elkaar op geteld. [Voorbeeld likes](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/views/partials/head.liquid#L116).

**Succes states**
<br>Voor het tonen van 'succes-states' worden er in de server [variabelen](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L188-L198) gemaakt op de gedane interacties. De variabelen worden [gerenderd](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/server.js#L200) aan een Liquid view. Met de variabelen kan er worden gecheckt of er een interactie gedaan is en zo ja, dan stuurt de Liquid view de bij behorende ['succes-state'](https://github.com/SieuwkeSheta/user-experience-enhanced-website/blob/d1f63882ed0ba871fc8ae3e64a22df4e3722e86b/views/partials/head.liquid#L186-L217).


## Installatie
Volg deze stappen om de development omgeving in te richten om aan deze repository te kunnen werken:

Stap 1) installeer de [NodeJS ontwikkelomgeving](https://nodejs.org/en/download). Kies voor NodeJS 24.13.0 (LTS, long-term support), download het installatiebestand en doorloop het installatieproces.

Stap 2) Fork deze repository, *clone* deze op jouw computer en open het in VSCodium/ een code editor.

Stap 3) Open de Terminal in VSCodium, Voer in de terminal het commando `npm install uit` door het in te typen en op enter te drukken.

Stap 4) Om `multipart/form-data` (bestanden) te kunnen POST'en is het handig om [Multer](https://www.npmjs.com/package/multer) te installeren in de terminal. 

Stap 5) Na de installatie is de map `node_modules` aangemaakt, en gevuld met allerlei packages. Start de website door in de terminal het comando `npm start` uit te voeren. Als het goed is, komt hier een melding te staan over het opstarten van de server: Application started on http://localhost:8000 — Open deze URL in je browser

## Bronnen
- [Figma ontwerpen van de opdrachtgever](https://www.figma.com/design/0sXvjvqboOmfDuFMUcRHJh/2025snappthisDesign?node-id=0-1&t=FGaH92iMbFUM6n4w-1)
- [Mijn Figma ontwerpen](https://www.figma.com/design/CWbf0ryEYaCeoeqj8jnGHe/Snappthis---Design-Challenge?node-id=405-1716&p=f&t=ICtBuKVDQBR67sub-01)
- [FDND Directus Snappthis database](https://fdnd-agency.directus.app/items/snappthis_action?fields=*,snap.snapmap.*,uuid.*)
- [Filter rules - @Directus](https://directus.io/docs/guides/connect/filter-rules)
- [Client side JS - @FDND](https://github.com/fdnd-task/user-experience-enhanced-website/blob/main/docs/client-side-scripting-for-ux.md)
- [Performant images - @FDND](https://github.com/fdnd-task/user-experience-enhanced-website/blob/main/docs/performant-images.md)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).

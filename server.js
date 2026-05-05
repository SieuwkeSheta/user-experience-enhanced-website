// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Importeer de multer package
import multer from 'multer';

// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

const upload = multer({ storage: multer.memoryStorage() });

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid()
app.engine('liquid', engine.express())

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')



// Maak een GET route voor de index (meestal doe je dit in de root, als /)
app.get('/', async function (request, response) {
  // Render index.liquid uit de Views map
  // Geef hier eventueel data aan mee
  response.render('index.liquid')
})

// Maak een GET route voor alle Groups in de database
app.get('/groups', async function (request, response) {

  const MultipleGroupslistapiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_group?fields=name,slug,snappmap.snappthis_snapmap_uuid.*&fields=count(users)')
  const MultipleGroupslistapiResponseJSON = await MultipleGroupslistapiResponse.json()
  // Geef hier eventueel data aan mee
  response.render('groups.liquid', { MultipleGroupslist: MultipleGroupslistapiResponseJSON.data })
})

// Maak een GET route voor one-group met alle snappmaps
app.get('/groups/:slug', async function (request, response) {

  const snappMapsapiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_group/?fields=*.*,snappmap.snappthis_snapmap_uuid.*&filter[slug]=' + request.params.slug)
  const snappMapsapiResponseJSON = await snappMapsapiResponse.json()

  // Geef hier eventueel data aan mee
  response.render('one-group.liquid', { SnappMapslist: snappMapsapiResponseJSON.data })
})

// Maak een GET route voor alle Groups in de database
app.get('/snappmaps', async function (request, response) {

  const MultipleSnappMapslistApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snapmap')
  const MultipleSnappMapslistApiResponseJSON = await MultipleSnappMapslistApiResponse.json()

  // Geef hier eventueel data aan mee
  response.render('snappmaps.liquid', { MultipleSnappMapslist: MultipleSnappMapslistApiResponseJSON.data })
})

// Maak een GET route voor one-snappmap met alle snapps
app.get('/snappmaps/:slug', async function (request, response) {

  const OneSnappMappInfoApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snapmap?fields=*.*,groups.snappthis_group_uuid.name,groups.snappthis_group_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.name,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.uuid&filter[slug]=' + request.params.slug)
  const OneSnappMappInfoApiResponseJSON = await OneSnappMappInfoApiResponse.json()

  // Geef hier eventueel data aan mee
  response.render('one-snappmap.liquid', {
    OneSnappMappInfos: OneSnappMappInfoApiResponseJSON.data,

    // Data om de url te checken op succes of error voor de POST request popup, 
    status: request.query.status,
  })
})

// Maak een GET route voor capture-snapp voor het maken van een snapp
app.get('/snappmaps/:slug/capture', async function (request, response) {

  const OneSnappMappNameApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snapmap?fields=name,slug,uuid&filter[slug]=' + request.params.slug)
  const OneSnappMappNameApiResponseJSON = await OneSnappMappNameApiResponse.json()

  // Geef hier eventueel data aan mee
  response.render('capture-snapp.liquid', {
    OneSnappMappNames: OneSnappMappNameApiResponseJSON.data,

    // Data om de url te checken op succes of error voor de POST request popup, 
    status: request.query.status
  })
})

// Maak een POST route voor het uploaden van snapps
app.post("/snappmaps/:slug", upload.single("file"), async (req, res) => {

  // Step 1: Upload file to Directus

  // Get the uploaded file from the form in HTML
  const file = req.file;

  // Create a new FormData object to send file data in a multipart/form-data request
  const formData = new FormData()
  const blob = new Blob([file.buffer], { type: file.mimetype })
  formData.append("file", blob, file.originalname)

  // Send a POST request to Directus API to upload the file
  const uploadResponse = await fetch("https://fdnd-agency.directus.app/files", {
    method: "POST",
    body: formData,
  })

  // Parse the JSON response from Directus
  const uploadResponseData = await uploadResponse.json();

  // Extract the file ID from the response (Directus returns "id", not "uuid")
  const imageId = uploadResponseData?.data?.id;

  // If no file ID is returned, the upload failed → send error response
  if (!imageId) {
    return res.send("Upload failed: No file ID returned");
  }

  // Step 2: Create new item in Directus

  // Get snappmap uuid from hidden input in form-element (capture-snapp.liquid)
  const snappmapuuid = req.body.uuid

  // Create an object representing the new item to store in Directus
  const newSnap = {
    location: "Amsterdam Zuidoost",
    snapmap: snappmapuuid,
    author: "467a4442-69e4-44ae-829a-b95e25c4dd7b",
    picture: imageId,
  };

  // Send a POST request to create a new item in Directus
  const snapResponse = await fetch("https://fdnd-agency.directus.app/items/snappthis_snap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newSnap),
  });

  // If new item creation failed → send error response
  if (!snapResponse.ok) {
    return res.redirect(303, `/snappmaps/${req.params.slug}/capture/?status=error`)
  }

  // If new item creation worked → Success response
  res.redirect(303, `/snappmaps/${req.params.slug}/?status=success`)
})

// Maak een GET route voor alle snapps in de database
app.get('/snapps', async function (request, response) {

  const MultipleSnappsApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.groups.snappthis_group_uuid.name&filter[picture][_neq]=null')
  const MultipleSnappsApiResponseJSON = await MultipleSnappsApiResponse.json()

  // Geef hier eventueel data aan mee
  response.render('snapps.liquid', { MultipleSnapps: MultipleSnappsApiResponseJSON.data, path: request.path })
})

// Render een error GET request
app.get('/snapps/location', async function (request, response) {

  // Geef hier eventueel data aan mee
  response.render('error.liquid')
})

// Maak een GET route voor alle snapps in de database op locatie
app.get('/snapps/location/:location', async function (request, response) {

  const MultipleSnappsApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.groups.snappthis_group_uuid.name&filter[picture][_neq]=null&filter[location]=' + request.params.location)
  const MultipleSnappsApiResponseJSON = await MultipleSnappsApiResponse.json()

  // Geef hier eventueel data aan mee
  response.render('snapps.liquid', { MultipleSnapps: MultipleSnappsApiResponseJSON.data, pathLocation: request.path })
})

// Maak een GET route voor one-snapp in de database
app.get('/snapps/:uuid', async function (request, response) {

  // Data van one-snapp in de database
  const OneSnappApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.uuid,snapmap.slug,snapmap.groups.snappthis_group_uuid.name,author.*&filter[uuid]=' + request.params.uuid)
  const OneSnappApiResponseJSON = await OneSnappApiResponse.json()

  // Data van alle likes per one-snapp in de database
  const LikesCountApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.groups.snappthis_group_uuid.name,author.*,actions.action,actions.user.name&deep[actions][_filter][action][_eq]=like&filter[uuid]=' + request.params.uuid)
  const LikesCountApiResponseJSON = await LikesCountApiResponse.json()

  // Data van alle dislikes per one-snapp in de database
  const TomatoCountApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.groups.snappthis_group_uuid.name,author.*,actions.action&deep[actions][_filter][action][_eq]=tomato&filter[uuid]=' + request.params.uuid)
  const TomatoCountApiResponseJSON = await TomatoCountApiResponse.json()

  // Data van alle stars per one-snapp in de database
  const StarCountApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.groups.snappthis_group_uuid.name,author.*,actions.action&deep[actions][_filter][action][_eq]=star&filter[uuid]=' + request.params.uuid)
  const StarCountApiResponseJSON = await StarCountApiResponse.json()


  // Voor het maken van een active state van de actions 'like', 'tomaat' en 'ster'
  // Persoon die de like, tomaat of ster geeft
  const userUuid = "467a4442-69e4-44ae-829a-b95e25c4dd7b"

  // Check of er een actie, 'like', 'tomaat' of 'ster', is uitgevoerd op de snapp met die specfieke persoon
  const userActionResponse = await fetch(`https://fdnd-agency.directus.app/items/snappthis_action?filter[snap][_eq]=${request.params.uuid}&filter[user][_eq]=${userUuid}`)
  const userActionData = await userActionResponse.json()


  // Check of er data zit in 'userActionData.data', zo ja gebruik de data. Zo niet, gebruik dan een lege lijst '[]'
  const actions = userActionData.data || []

  // Check of er een actie 'like' is uitgevoerd
  const hasLike = actions.some(a => a.action === "like")

  // Check of er een actie 'tomaat' is uitgevoerd
  const hasTomato = actions.some(a => a.action === "tomato")

  // Check of er een actie 'ster' is uitgevoerd
  const hasStar = actions.some(a => a.action === "star")

  // Geef hier eventueel data aan mee
  response.render('one-snapp.liquid', {
    OneSnapps: OneSnappApiResponseJSON.data,
    Likescounts: LikesCountApiResponseJSON.data,
    Tomatocounts: TomatoCountApiResponseJSON.data,
    Starcounts: StarCountApiResponseJSON.data
  })
})






  })

  res.redirect(303, `/snappmaps/${snappMappSlug}`)
})



// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000; als deze applicatie ergens gehost wordt, waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, gebruik daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

// Render een liquid pagina als er een foutmelding is / pagina niet bestaat
app.use((req, res, next) => {
  res.status(404).render('error.liquid')
})
// import express from 'express'
// import { Liquid } from 'liquidjs';
// import multer from 'multer';

// const app = express()
// const engine = new Liquid()
// const upload = multer({ storage: multer.memoryStorage() });

// app.use(express.urlencoded({ extended: true }))
// app.use(express.static('public'))
// app.engine('liquid', engine.express())
// app.set('views', './views')

// app.get('/', async function (request, response) {
//   response.render('index.liquid')
// })

// app.get('/groups', async function (request, response) {
//   const MultipleGroupslistapiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_group?fields=name,slug,snappmap.snappthis_snapmap_uuid.*&fields=count(users)')
//   const MultipleGroupslistapiResponseJSON = await MultipleGroupslistapiResponse.json()

//   response.render('groups.liquid', { MultipleGroupslist: MultipleGroupslistapiResponseJSON.data })
// })

// app.get('/groups/:slug', async function (request, response) {
//   const snappMapsapiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_group/?fields=*.*,snappmap.snappthis_snapmap_uuid.*&filter[slug]=' + request.params.slug)
//   const snappMapsapiResponseJSON = await snappMapsapiResponse.json()

//   response.render('one-group.liquid', { SnappMapslist: snappMapsapiResponseJSON.data })
// })

// app.get('/snappmaps', async function (request, response) {
//   const MultipleSnappMapslistApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snapmap')
//   const MultipleSnappMapslistApiResponseJSON = await MultipleSnappMapslistApiResponse.json()

//   response.render('snappmaps.liquid', { MultipleSnappMapslist: MultipleSnappMapslistApiResponseJSON.data })
// })

// app.get('/snappmaps/:slug', async function (request, response) {
//   const OneSnappMappInfoApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snapmap?fields=*.*,groups.snappthis_group_uuid.name,groups.snappthis_group_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.name,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.slug,groups.snappthis_group_uuid.snappmap.snappthis_snapmap_uuid.uuid&filter[slug]=' + request.params.slug)
//   const OneSnappMappInfoApiResponseJSON = await OneSnappMappInfoApiResponse.json()

//   response.render('one-snappmap.liquid', {
//     OneSnappMappInfos: OneSnappMappInfoApiResponseJSON.data, 
//     status: request.query.status,
//   })
// })

// app.get('/snappmaps/:slug/capture', async function (request, response) {
//   const OneSnappMappNameApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snapmap?fields=name,slug,uuid&filter[slug]=' + request.params.slug)
//   const OneSnappMappNameApiResponseJSON = await OneSnappMappNameApiResponse.json()

//   response.render('capture-snapp.liquid', {
//     OneSnappMappNames: OneSnappMappNameApiResponseJSON.data,
//     status: request.query.status
//   })
// })

// app.post("/snappmaps/:slug", upload.single("file"), async (req, res) => {
//   const file = req.file;
//   const formData = new FormData()
//   const blob = new Blob([file.buffer], { type: file.mimetype })

//   formData.append("file", blob, file.originalname)

//   const uploadResponse = await fetch("https://fdnd-agency.directus.app/files", {
//     method: "POST",
//     body: formData,
//   })

//   const uploadResponseData = await uploadResponse.json();
//   const imageId = uploadResponseData?.data?.id;

//   if (!imageId) {
//     return res.send("Upload failed: No file ID returned");
//   }

//   const snappmapuuid = req.body.uuid
//   const newSnap = {
//     location: "Amsterdam Zuidoost",
//     snapmap: snappmapuuid,
//     author: "467a4442-69e4-44ae-829a-b95e25c4dd7b",
//     picture: imageId,
//   };

//   const snapResponse = await fetch("https://fdnd-agency.directus.app/items/snappthis_snap", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newSnap),
//   });

//   if (!snapResponse.ok) {
//     return res.redirect(303, `/snappmaps/${req.params.slug}/capture/?status=error`)
//   }

//   res.redirect(303, `/snappmaps/${req.params.slug}/?status=success`)
// })

// app.get('/snapps', async function (request, response) {
//   const MultipleSnappsApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.groups.snappthis_group_uuid.name&filter[picture][_neq]=null')
//   const MultipleSnappsApiResponseJSON = await MultipleSnappsApiResponse.json()

//   response.render('snapps.liquid', { MultipleSnapps: MultipleSnappsApiResponseJSON.data, path: request.path })
// })

// app.get('/snapps/location', async function (request, response) {

//   response.render('error.liquid')
// })

// app.get('/snapps/location/:location', async function (request, response) {
//   const MultipleSnappsApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.groups.snappthis_group_uuid.name&filter[picture][_neq]=null&filter[location]=' + request.params.location)
//   const MultipleSnappsApiResponseJSON = await MultipleSnappsApiResponse.json()

//   response.render('snapps.liquid', { MultipleSnapps: MultipleSnappsApiResponseJSON.data, pathLocation: request.path })
// })

// app.get('/snapps/:uuid', async function (request, response) {
//   const OneSnappApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.uuid,snapmap.slug,snapmap.groups.snappthis_group_uuid.name,author.*&filter[uuid]=' + request.params.uuid)
//   const OneSnappApiResponseJSON = await OneSnappApiResponse.json()

//   const LikesCountApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.groups.snappthis_group_uuid.name,author.*,actions.action,actions.user.name&deep[actions][_filter][action][_eq]=like&filter[uuid]=' + request.params.uuid)
//   const LikesCountApiResponseJSON = await LikesCountApiResponse.json()

//   const TomatoCountApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.groups.snappthis_group_uuid.name,author.*,actions.action&deep[actions][_filter][action][_eq]=tomato&filter[uuid]=' + request.params.uuid)
//   const TomatoCountApiResponseJSON = await TomatoCountApiResponse.json()

//   const StarCountApiResponse = await fetch('https://fdnd-agency.directus.app/items/snappthis_snap?fields=*,snapmap.name,snapmap.groups.snappthis_group_uuid.name,author.*,actions.action&deep[actions][_filter][action][_eq]=star&filter[uuid]=' + request.params.uuid)
//   const StarCountApiResponseJSON = await StarCountApiResponse.json()

//   const userUuid = "467a4442-69e4-44ae-829a-b95e25c4dd7b"

//   const userActionResponse = await fetch(`https://fdnd-agency.directus.app/items/snappthis_action?filter[snap][_eq]=${request.params.uuid}&filter[user][_eq]=${userUuid}`)
//   const userActionData = await userActionResponse.json()

//   const actions = userActionData.data || []
//   const hasLike = actions.some(a => a.action === "like")
//   const hasTomato = actions.some(a => a.action === "tomato")
//   const hasStar = actions.some(a => a.action === "star")

//   response.render('one-snapp.liquid', {
//     OneSnapps: OneSnappApiResponseJSON.data,
//     Likescounts: LikesCountApiResponseJSON.data,
//     Tomatocounts: TomatoCountApiResponseJSON.data,
//     Starcounts: StarCountApiResponseJSON.data,
//     status: request.query.status,
//     hasLike,
//     hasTomato,
//     hasStar
//   })
// })

// app.post('/snapps/:uuid/action', async function (request, response) {
//   const actionType = request.body.action
//   const snappUuid = request.params.uuid
//   const userUuid = "467a4442-69e4-44ae-829a-b95e25c4dd7b"

//   const starResponse = await fetch(`https://fdnd-agency.directus.app/items/snappthis_action?filter[action][_eq]=star&filter[snap][_eq]=${snappUuid}&filter[user][_eq]=${userUuid}`)
//   const starData = await starResponse.json()
//   const starAction = starData.data[0]

//   const likeOrTomatoResponse = await fetch(`https://fdnd-agency.directus.app/items/snappthis_action?filter[action][_neq]=star&filter[snap][_eq]=${snappUuid}&filter[user][_eq]=${userUuid}`)
//   const likeOrTomatoData = await likeOrTomatoResponse.json()
//   const likeOrTomatoAction = likeOrTomatoData.data[0]

//   try {
//     if (actionType === "star") {
//       if (starAction) {
//         await fetch(`https://fdnd-agency.directus.app/items/snappthis_action/${starAction.uuid}`, {
//           method: "DELETE",
//         })

//         return response.redirect(303, `/snapps/${snappUuid}?status=star-removed`)

//       } else {
//         await fetch("https://fdnd-agency.directus.app/items/snappthis_action", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },

//           body: JSON.stringify({
//             snap: snappUuid,
//             user: userUuid,
//             action: "star"
//           })
//         })

//         return response.redirect(303, `/snapps/${snappUuid}?status=star-added`)
//       }

//     } else {
//       if (!likeOrTomatoAction) {
//         await fetch("https://fdnd-agency.directus.app/items/snappthis_action", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },

//           body: JSON.stringify({
//             snap: snappUuid,
//             user: userUuid,
//             action: actionType
//           })
//         })

//         return response.redirect(303, `/snapps/${snappUuid}?status=${actionType}-added`)

//       } else {

//         if (likeOrTomatoAction.action === actionType) {
//           await fetch(`https://fdnd-agency.directus.app/items/snappthis_action/${likeOrTomatoAction.uuid}`, {
//             method: "DELETE",
//           })

//           return response.redirect(303, `/snapps/${snappUuid}?status=${actionType}-removed`)

//         } else {
//           await fetch(`https://fdnd-agency.directus.app/items/snappthis_action/${likeOrTomatoAction.uuid}`, {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json"
//             },

//             body: JSON.stringify({
//               action: actionType
//             })
//           })

//           return response.redirect(303, `/snapps/${snappUuid}?status=switched-to-${actionType}`)
//         }
//       }
//     }
    
//   } catch (error) {
//     console.error(error)
//     return response.redirect(303, `/snapps/${snappUuid}?status=error`)
//   }
// })

// app.post("/snapps/delete/:uuid", async (req, res) => {
//   const snappUuid = req.params.uuid
//   const snappMappSlug = req.body.slug

//   await fetch(`https://fdnd-agency.directus.app/items/snappthis_snap/${snappUuid}`, {
//     method: "DELETE",
//   })

//   res.redirect(303, `/snappmaps/${snappMappSlug}`)
// })

// app.set('port', process.env.PORT || 8000)

// app.listen(app.get('port'), function () {
//   console.log(`Application started on http://localhost:${app.get('port')}`)
// })

// app.use((req, res, next) => {
//   res.status(404).render('error.liquid')
// })
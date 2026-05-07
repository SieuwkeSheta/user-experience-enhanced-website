// 1. variables
// Zoeken elementen op in de DOM
const imageInputSelector = document.getElementById("upload-snapp")
const imagePreview = document.getElementById("display-image")
const sendButton = document.getElementById("send-button")

// 2.logic
// Als er een element is met 'imageInputSelector'
if (imageInputSelector) {
  // Wacht tot input veranderd
  imageInputSelector.addEventListener('change', handleImageUpload)
}

// 3. function declarations
function handleImageUpload(event) {

  // Stap 1: Zoek data van geselecteerde foto
  const imageData = event.target.files[0];

  // Stap 2: Maak een nieuwe Filereader aan
  const imageReader = new FileReader();

  // Stap 3: Maak foto van opgehaalde fotodata
  imageReader.readAsDataURL(imageData);

  // Stap 4: Trigger geselecteerde foto om te laten zien
  imageReader.addEventListener("load", previewImage)

  // Stap 5: Laat geselecteerde foto zien
  function previewImage(event) {
    // Stap 5: Laat geselecteerde foto zien
    imagePreview.src = imageReader.result;

    // Voeg een class toe aan de submit button om het zichtbaar te maken
    sendButton.classList.add("display")
  }

}



// Als er ergens op de pagina een formulier wordt gesubmit..
document.addEventListener("submit", async function (event) {
  // 1. variables
  // Hou in een variabele bij welk formulier dat was
  const form = event.target
  const actionURL = form.getAttribute("action")
  const method = form.method
  const buttons = form.querySelectorAll("button[name='action']") // buttons inside current form
  const formData = new FormData(form) // Verzamel alle formuliervelden van het formulier
  const clickedButton = event.submitter

  // 2. logic
  // Als dit formulier geen class heeft met 'like-dislike-save-form', doe dan niks speciaals (laat het formulier normaal versturen)
  // Als dit formulier wel de class heeft met 'like-dislike-save-form', enhance het
  if (!form.classList.contains("like-dislike-save-form")) {
    return
  }

  // Voorkom de standaard submit van de browser
  // Let op: hiermee overschrijven we de default Loading state van de browser...
  event.preventDefault()

  // Loading state
  if (clickedButton) {
    clickedButton.classList.add("loading")
    clickedButton.textContent = "loading..."
  }

  buttons.forEach(function(btn){
    btn.disabled = true
  })

  if (clickedButton?.name && clickedButton?.value) {
    formData.append(clickedButton.name, clickedButton.value)
  }

  // Fetch request
  const response = await fetch(actionURL, {
    method,
    body: new URLSearchParams(formData),
    credentials: "same-origin"
  })

  const responseText = await response.text()

  // Parse response HTML
  const parser = new DOMParser()
  const responseDOM = parser.parseFromString(responseText, "text/html")

  const newForm = responseDOM.querySelector(".like-dislike-save-form")

  if (!newForm) {
    console.error("No updated form found in response")
    return
  }

  // Keep clicked value before DOM replacement
  const clickedValue = clickedButton?.value

  // Replace old form with new one
  form.replaceWith(newForm)

  // Re-bind after replacement (IMPORTANT)
  const updatedForm = document.querySelector(".like-dislike-save-form")
  const updatedButtons = updatedForm.querySelectorAll("button[name='action']")

  // Success state
  if (clickedValue) {
    const successButton = updatedForm.querySelector(
      `button[value="${clickedValue}"]`
    )

    if (successButton) {
      successButton.classList.add("success")

      setTimeout(() => {
        successButton.classList.remove("success")
      }, 1500)
    }
  }

  // Loading state weghalen
  console.log("Loading state weghalen")

  // Re-enable buttons + cleanup loading state
  // updatedButtons.forEach(btn => {
  //   btn.disabled = false
  //   btn.classList.remove("loading")
  // })

  updatedButtons.forEach(loading)

  // 3. function declarations
 function loading (btn) {
    btn.disabled = false
    btn.classList.remove("loading")
 }
})




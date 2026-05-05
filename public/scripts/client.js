// Zoeken elementen op in de DOM
const imageInputSelector = document.getElementById("upload-snapp")
const imagePreview = document.getElementById("display-image")
const sendButton = document.getElementById("send-button")

// Als er een element is met 'imageInputSelector'
if (imageInputSelector) {
  // Wacht tot input veranderd
  imageInputSelector.addEventListener('change', handleImageUpload)
}

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
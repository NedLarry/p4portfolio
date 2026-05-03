
const worksContainer = document.querySelector(".works");
const imageContainer = document.querySelector(".imgSelect");

var dataObject = []

var imageNames = ["me.jpg", "me2.jpd", "me3.jpg", "me4.jpg"]

function FormulateImgElement(pd) {
    var element = document.createElement("a")
    element.text = pd.name
    element.href = pd.html_url
    element.target = "_blank"
    element.setAttribute("class", "works")
    dataObject.push(element)
    dataObject.forEach(AppendElement)
}

SetImageElement()

function SetImageElement (){

    var index = Math.floor(Math.random() * 5);

    var imgToShw = imageNames[index];

    console.log(imgToShw);

    imageContainer.setAttribute('src', `.././images/{imgToShw}`)
}
   
function AppendElement(pd) {
    worksContainer.appendChild(pd)
}  
fetch('https://relaxed-torrone-ead861.netlify.app/', {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    data.forEach(FormulateImgElement)
})
.catch(error => console.error('Error:', error));



 


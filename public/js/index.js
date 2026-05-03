
const worksContainer = document.querySelector(".works");
const imageContainer = document.querySelector(".imgSelect");

var dataObject = []

var imageNames = ["./images/me.jpg", "./images/me2.jpg", "./images/me3.jpg", "./images/me4.jpg"]

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
    var index = Math.floor(Math.random() * 4);
    var imgToShw = imageNames[index];
    imageContainer.setAttribute('src', `${imgToShw}`)
}
   
function AppendElement(pd) {
    worksContainer.appendChild(pd)
}  
fetch('/repos', {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    data.forEach(FormulateImgElement)
})
.catch(error => console.error('Error:', error));



 


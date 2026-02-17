
const imageContainer = document.querySelector(".works");

var dataObject = []

function FormulateImgElement(pd) {
    var element = document.createElement("a")
    element.text = pd.name
    element.href = pd.html_url
    element.target = "_blank"
    element.setAttribute("class", "works")
    dataObject.push(element)
    dataObject.forEach(AppendElement)
}
   
function AppendElement(pd) {
    imageContainer.appendChild(pd)
}  
fetch('https://relaxed-torrone-ead861.netlify.app/', {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    data.forEach(FormulateImgElement)
})
.catch(error => console.error('Error:', error));



 


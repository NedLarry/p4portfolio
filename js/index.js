

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
fetch('https://api.github.com/users/nedlarry/repos', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'Authorization': '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',
        'X-GitHub-Api-Version': '2022-11-28'
    }
})
.then(response => response.json())
.then(data => {
    data.forEach(FormulateImgElement)
})
.catch(error => console.error('Error:', error));



 


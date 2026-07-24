
const worksContainer = document.querySelector(".works");
const imageContainer = document.querySelector(".imgSelect");
const chinedudModal = document.getElementById("chinedud-modal");

const DUMMY_ICON = "/projects/images/dummy.svg";
var imageNames = ["./images/me.jpg", "./images/me2.jpg", "./images/me3.jpg", "./images/me4.jpg"];

function CreateProjectCard(project) {
    var card = document.createElement("a");
    card.href = project.url;
    card.target = "_blank";
    card.title = project.description || "";
    card.setAttribute("class", "project-card");

    var icon = document.createElement("img");
    icon.className = "project-icon";
    icon.alt = `${project.projectname} icon`;
    icon.src = project.icon;
    icon.onerror = function () {
        this.onerror = null;
        this.src = DUMMY_ICON;
    };

    var name = document.createElement("span");
    name.className = "project-name";
    name.textContent = project.projectname;

    card.appendChild(icon);
    card.appendChild(name);
    worksContainer.appendChild(card);
}

SetImageElement();

function SetImageElement() {
    var index = Math.floor(Math.random() * imageNames.length);
    var imgToShw = imageNames[index];
    imageContainer.setAttribute('src', `${imgToShw}`);

    if (imgToShw.includes('me4.jpg')) {
        ShowChinedudModal();
    }
}

function ShowChinedudModal() {
    if (chinedudModal && typeof chinedudModal.showModal === 'function') {
        chinedudModal.showModal();
    }
}

fetch('/projects/projects.json', {
    method: 'GET'
})
.then(response => response.json())
.then(data => {
    data.forEach(CreateProjectCard);
})
.catch(error => console.error('Error:', error));

const dropeZone = document.querySelector(".drop-zone");
const inputField = document.querySelector(".file-input");
const browseBtn = document.querySelector(".browse-btn");

const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;


// Enter in Area
dropeZone.addEventListener("dragover" , (e) => {
    e.preventDefault();
    if (!dropeZone.classList.contains("dragged")) {
        dropeZone.classList.add("dragged");
    }
});

// Leave in area
dropeZone.addEventListener("dragleave", () => {
    dropeZone.classList.remove("dragged");
})

//droping event
dropeZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropeZone.classList.remove("dragged");
    const files = e.dataTransfer.files;
    if (files.length) {
        inputField.files = files;
        uploadFile();
    }
});

browseBtn.addEventListener("click", (e) => {
    inputField.click();
})

const uploadFile = () => {
    const file = inputField.files[0];
    const formData = new FormData();
    formData.append("myfile",file);

    const xhrRequest = new XMLHttpRequest();
    xhrRequest.onreadystatechange = () => {
        if (xhrRequest.readyState === XMLHttpRequest.DONE) {
            console.log(xhrRequest.response);
        }
    }
    xhrRequest.open("POST", uploadURL);
    xhrRequest.send(formData);
}



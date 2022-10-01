const dropeZone = document.querySelector(".drop-zone");
const inputField = document.querySelector(".file-input");
console.log(inputField)
const browseBtn = document.querySelector(".browse-btn");
console.log(browseBtn)
// console.log(dropeZone);

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
    console.table(files)
    if (files.length) {
        inputField.files = files;
    }
});

browseBtn.addEventListener("click", (e) => {
    inputField.click();
})



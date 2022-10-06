const dropeZone = document.querySelector(".drop-zone");
const inputField = document.querySelector(".file-input");
const browseBtn = document.querySelector(".browse-btn");
const bgProgress = document.querySelector(".bg-progress");
const percentProgress = document.querySelector(".percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");
const fileURLInput = document.querySelector("#fileURL");
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copy-btn");
const emailForm = document.querySelector("#emailForm");
const toast = document.querySelector(".toast");

const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;

const maxAllowedSize = 100 * 1024 * 1024; //100mb



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
    if (files.length === 1) {
        if (files[0].size < maxAllowedSize) {
            fileURLInput.files = files;
            uploadFile()
        }else {
            showToast("Max file size is 100MB")
        }
    }
});

//for uploading file
inputField.addEventListener("change",() => {
//    console.log("hello")
    uploadFile();
});


browseBtn.addEventListener("click", (e) => {
    inputField.click();
})

copyBtn.addEventListener("click",() => {
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Link copied");
})

const uploadFile = () => {
    console.log("file added uploading");

    
    // if (fileURLInput.files.length > 1) {
    //    resetFileInput()
    //     showToast("Only upload 1 file");
    //     return;
    // }
    const file = inputField.files[0];
    // console.log(file.size)

    // if (file.size > maxAllowedSize) {
    //     showToast("Can't upload more than 100MB");
    //     resetFileInput();
    //     return;
    // }

    progressContainer.style.display = "block";

    // emailForm[2].setAttribute("disabled", "true");
    const formData = new FormData();
    formData.append("myfile",file);

    const xhrRequest = new XMLHttpRequest();
    xhrRequest.onreadystatechange = () => {
        if (xhrRequest.readyState == XMLHttpRequest.DONE) {
            onUploadSuccess(JSON.parse(xhrRequest.response));
            // onUploadSuccess(xhrRequest.response);
        }
    }

    //upload progress
    xhrRequest.upload.onprogress = updateProgress;

    //for error
    xhrRequest.upload.onerror = () => {
        showToast(`Error in upload : ${xhrRequest.statusText}`);
        resetFileInput();
    }

    xhrRequest.open("POST", uploadURL);
    xhrRequest.send(formData);
}


//function for upload progress
const updateProgress = (e) => {
    //show us how much it uploaded
    const percent = Math.round((e.loaded / e.total) * 100);
    // console.log(percent);
    bgProgress.style.width = `${percent}%`;
    percentProgress.innerText = percent;
    progressBar.style.transform = `scaleX(${percent/100})`;
}

const onUploadSuccess = ({file : url}) => {
    // console.log(url);
    resetFileInput()
    emailForm[2].removeAttribute("disabled", "true");
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    // console.log(url);
    fileURLInput.value = url;
}

const resetFileInput = () => {
    fileURLInput.value = "";
}

emailForm.addEventListener("submit",(e) => {
    e.preventDefault();

    const url = fileURLInput.value;
    const formData = {
        uuid: url.split("/").splice(-1,1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value,
    };

    // console.log(formData);

    // console.table(formData);
    emailForm[2].setAttribute("disabled", "true");

    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(formData)
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.success) {
            showToast("Email Sent");
            sharingContainer.style.display = "none";
        }
    });
})

let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50% , 0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50% , 60px)";
    },2000);
}






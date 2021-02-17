(function (window, document, $) {
    "use strict";

    $(".pickadate-limits").pickadate({
        min: [1947, 3, 20],
        max: [2010, 5, 28],
    });

    $(".format-picker").pickadate({
        format: "mmmm, d, yyyy",
    });

    $(".pickadate-months").pickadate({
        selectYears: false,
        selectMonths: true,
    });
});

function imageError(data) {
    data.src = "/assets/images/demo/notfound.png";
}

function makeToast() {
    const messages = $("#siteToast").data("messages");
    const match = $("#siteToast").data("match");
    switch (match) {
        case "info":
            toastr.info(messages, "Information");
            break;
        case "danger":
            toastr.error(messages, "Error");
            break;
        case "success":
            toastr.success(messages, "Success");
            break;
        case "warning":
            toastr.warning(messages, "Warning");
            break;

        default:
            toastr.info("No Message", "Information");
            break;
    }
}

if (document.getElementById("file-input")) {
    (() => {
        document.getElementById("file-input").onchange = () => {
            if (document.getElementById("form-submit")) {
                document
                    .getElementById("form-submit")
                    .setAttribute("disabled", "disabled");
            }
            const files = document.getElementById("file-input").files;
            const file = files[0];
            if (file == null) {
                return alert("No file selected.");
            }
            getSignedRequest(file);
        };
    })();
}
function getSignedRequest(file) {
    var folderName = document.getElementById("folder-name").value;
    const xhr = new XMLHttpRequest();
    xhr.open(
        "GET",
        `/api/put-sign-s3?file-name=${file.name}&file-type=${file.type}&folder=${folderName}`
    );
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                uploadFile(
                    file,
                    response.data.signedRequest,
                    `${folderName}/${file.name}`
                );
            } else {
                console.log("Could not get signed URL.");
            }
        }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const geturl = new XMLHttpRequest();
                geturl.open("GET", `/api/get-sign-s3?name=${url}`);
                geturl.onreadystatechange = () => {
                    if (geturl.readyState === 4) {
                        if (geturl.status === 200) {
                            const response = JSON.parse(geturl.responseText);
                            document.getElementById("preview").src =
                                response.data.url;
                        } else {
                            console.log("Could not get signed URL.");
                        }
                    }
                };
                geturl.send();
                document.getElementById("avatar").value = url;
                document
                    .getElementById("form-submit")
                    .removeAttribute("disabled");
            } else {
                console.log("Could not upload file.");
            }
        }
    };
    xhr.send(file);
}

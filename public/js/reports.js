console.log('reports.js')

let generateButton = document.getElementById("generateButton");
let downloadButton = document.getElementById("downloadButton");

generateButton.onclick = function(){
    fetch('/reports/generate').then((response) => {
        response.json().then((data) => {
            if(data.error) {
                document.getElementById("alertMessage").innerHTML = '<div class="alert alert-danger" role="alert" id="alertMessage">My Stock Tracker was unable to connect to the database. Please try again later.</div>';
            } else {
                downloadButton.classList.remove("disabled")
                downloadButton.classList.remove("btn-outline-secondary")
                downloadButton.classList.add("btn-success")
            }
        })
    })    
};
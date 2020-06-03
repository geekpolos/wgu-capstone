console.log('reports.js')

let generateButton = document.getElementById("generateButton");
let downloadButton = document.getElementById("downloadButton");

generateButton.onclick = function(){
    downloadButton.classList.remove("disabled")
    downloadButton.classList.remove("btn-outline-secondary")
    downloadButton.classList.add("btn-success")
};
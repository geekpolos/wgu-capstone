console.log('Loaded from track-stocks.js')

const stockTable = document.querySelector('stock-table-body')

fetch('/track-stocks/get').then((response) => {
    response.json().then((data) => {
        if (data.error) {
            console.log('something went wrong')
            //messageOne.textContent = data.error
        } else {
            console.log(data)

            var table = document.getElementById("stock-table");

            var rowNode = document.createElement("tr");
            var cellNode = document.createElement("td");
            var textNode = document.createTextNode(data.stock.ticker);

            cellNode.appendChild(textNode);
            rowNode.appendChild(cellNode);
            table.appendChild(rowNode);

            console.log('should be done')
        }
    })    
})
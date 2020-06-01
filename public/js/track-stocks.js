console.log('Loaded from track-stocks.js')

const stockTable = document.querySelector('stock-table-body')

fetch('/track-stocks/get').then((response) => {
    response.json().then((data) => {
        if (data.error) {
            document.getElementById("alertMessage").innerHTML = '<div class="alert alert-danger" role="alert" id="alertMessage">My Stock Tracker was unable to connect to the database. Please try again later.</div>';            
        } else {            
            let counter = 0;

            data.forEach(function(table) {
                
                let ticker = table.ticker;
                let quantity = table.quantity
                let price = table.price
                counter++;

                var select = document.getElementById("stockDropdownMenu");
                select.options[select.options.length] = new Option(ticker, ticker);

                /* Populate stock table with user stock information */
                let stockTable = document.getElementById("stock-table");
                let rowNode = document.createElement("tr");
                
                let numberNode = document.createElement("th")
                let numberDisplay = document.createTextNode(counter)
                numberNode.appendChild(numberDisplay)
                rowNode.appendChild(numberNode)

                let tickerNode = document.createElement("td");
                let tickerText = document.createTextNode(ticker);
                tickerNode.appendChild(tickerText);
                rowNode.appendChild(tickerNode);

                let quantityNode = document.createElement("td")
                let quantityText = document.createTextNode(quantity)
                quantityNode.appendChild(quantityText)
                rowNode.appendChild(quantityNode)

                let priceNode = document.createElement("td")
                let priceText = document.createTextNode("$" + price)
                priceNode.appendChild(priceText)
                rowNode.appendChild(priceNode)

                let valueNode = document.createElement("td")
                let valueText = document.createTextNode("$" + quantity * price)
                valueNode.appendChild(valueText)
                rowNode.appendChild(valueNode)

                stockTable.appendChild(rowNode);
            });            
        }
    })    
})

function myFunction() {
    var value = document.getElementById("stockDropdownMenu").value;
    
    if(value !== 'add-stock') {        
        fetch('/track-stocks/get?ticker='+value).then((response) => {
            response.json().then((data) => {
                if(data.error) {
                    document.getElementById("alertMessage").innerHTML = '<div class="alert alert-danger" role="alert" id="alertMessage">My Stock Tracker was unable to connect to the database. Please try again later.</div>';
                } else {
                    console.log(data)
                    document.getElementById("ticker").value = value;
                    document.getElementById("quantity").value = data[0].quantity;
                    document.getElementById("price").value = data[0].price;
                }
            })
        })
    }
}
/*
Name: PopulateStocks
Description: Using the JSON from /track-stocks/get, the fetch below will populate the current stocks table and the drop down menu.
*/
fetch('/track-stocks/get').then((response) => {
    response.json().then((data) => {
        if (data.error) {
            document.getElementById("alertMessage").innerHTML = '<div class="alert alert-danger" role="alert" id="alertMessage">My Stock Tracker was unable to connect to the database. Please try again later.</div>';            
        } else {            
            let counter = 0;

            data.forEach(function(table) {
                
                let tickerid = table._id
                let ticker = table.ticker;
                let quantity = table.quantity
                let price = table.price
                counter++;

                /* Populate the add/update ticker drop down menu */
                let select = document.getElementById("stockDropdownMenu");
                select.options[select.options.length] = new Option(ticker, ticker);

                /* Populate the delete ticker drop down menu */
                let selectDelete = document.getElementById("stockDeleteDropdownMenu");
                selectDelete.options[selectDelete.options.length] = new Option(ticker, tickerid);

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

/* 
Name: onDropdownChange
Description: This function will update the ticker, quantity, and price input fields when a new ticker is selected in the dropdown menu. 
*/
function onDropdownChange() {
    let value = document.getElementById("stockDropdownMenu").value;
    
    if(value !== 'add-stock') {        
        fetch('/track-stocks/get?ticker='+value).then((response) => {
            response.json().then((data) => {
                if(data.error) {
                    document.getElementById("alertMessage").innerHTML = '<div class="alert alert-danger" role="alert" id="alertMessage">My Stock Tracker was unable to connect to the database. Please try again later.</div>';
                } else {
                    document.getElementById("ticker").value = value;
                    document.getElementById("quantity").value = data[0].quantity;
                    document.getElementById("price").value = data[0].price;
                }
            })
        })
    }
}

/*
Name: submitStockInformation
Description: On the update/add form, the user can select add stock or update a stock. If the user add a stock, a stock will be added to the collection as a new document. If the user chooses udpate, the quantity and price will be udpated. 
*/
function submitStockInformation() {
    let ticker = document.getElementById("ticker").value
    let quantity = document.getElementById("quantity").value
    let price = document.getElementById("price").value
    let selectValue = document.getElementById("stockDropdownMenu").value 
    let fetchURL = '/track-stocks/update?ticker='+ticker+'&quantity='+quantity+'&price='+price+'&add=false'

    if(selectValue === 'add-stock') {
        fetchURL = '/track-stocks/update?ticker='+ticker+'&quantity='+quantity+'&price='+price+'&add=true'        
    }

    fetch(fetchURL).then((response) => {
        response.json().then((data) => {
            if(data.error) {
                document.getElementById("alertMessage").innerHTML = '<div class="alert alert-danger" role="alert" id="alertMessage">My Stock Tracker was unable to connect to the database. Please try again later.</div>';
            } else {
                //alert('/track-stocks/update?ticker='+ticker)
            }
        })
    })
}

/*
Name: 
Description: 
*/
function deleteStockInformation() {
    let tickerid = document.getElementById("stockDeleteDropdownMenu").value
    let deleteValue = document.getElementById("stockDeleteDropdownMenu").value 
    
    if(deleteValue !== "default") {
        fetchURL = '/track-stocks/delete?id='+tickerid

        fetch(fetchURL).then((response) => {
            response.json().then((data) => {
                if(data.error) {
                    document.getElementById("alertMessage").innerHTML = '<div class="alert alert-danger" role="alert" id="alertMessage">My Stock Tracker was unable to connect to the database. Please try again later.</div>';
                } else {
                    //alert('/track-stocks/update?ticker='+ticker)
                }
            })
        })
    } 
}
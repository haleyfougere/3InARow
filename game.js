//source: https://www.w3schools.com/js/js_htmldom_eventlistener.asp
//source: https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers
//source: https://www.w3schools.com/jsref/dom_obj_pushbutton.asp
//source: https://www.w3schools.com/howto/howto_js_add_class.asp

let originalGameState = null;
let targetDiv = document.querySelector("#theGame");

// Create a title element (h1) and set its text content
var title = document.createElement("h1");
title.textContent = "3 in a Row Game";

//use the API to draw the starting grid
const processAPIResults = (data) => {

    //parse data from JSON API
    let rows = data.rows;

    //add the title
    targetDiv.appendChild(title);

    let newTableElement = document.createElement("table");

    rows.forEach((row, rowIndex) => {

        let newRowElement = document.createElement("tr");

        row.forEach((cell) => {
            let newCellElement = document.createElement("td");

            // Assign a class to the cell based on its currentState
            let cellStateClass = `currentState${cell.currentState}`;
            newCellElement.classList.add(cellStateClass);

            // Set data attributes for further use (e.g., in event listeners)
            newCellElement.setAttribute("data-can-toggle", cell.canToggle);
            newCellElement.setAttribute("data-current-state", cell.currentState);
            newCellElement.setAttribute("data-correct-state", cell.correctState);
            //adding click attribute
            newCellElement.setAttribute("data-clicked", "false");


            if(cell.canToggle){
                newCellElement.addEventListener("click", () => {
                    // Retrieve the current state from the cell's attribute
                    let currentState = parseInt(newCellElement.getAttribute("data-current-state"));
                    // Calculate the next state, and it cycles back to 0 after 2
                    let nextState = (currentState + 1) % 3;
                    // Update the cell's data attribute to the new state
                    newCellElement.setAttribute("data-current-state", nextState);

                    // Remove the previous state class
                    newCellElement.classList.remove(`currentState${currentState}`);
                    // Add the new state class
                    newCellElement.classList.add(`currentState${nextState}`);

                    // the cell has been clicked
                    newCellElement.setAttribute("data-clicked", "true");

                })
            }

            // Append the cell to the row
            newRowElement.appendChild(newCellElement);
        })
        // Append the row to the table
        newTableElement.appendChild(newRowElement);
    });

    // Append the table to the div
    targetDiv.appendChild(newTableElement);
}

$(document).ready(() => {

    $.ajax({
        url: "https://prog2700.onrender.com/threeinarow/sample",
        type: "GET",
        success: (result) => {
            console.log(result);
            originalGameState = result;
            processAPIResults(result);
        }
    });

    addElements();

});

const checkPuzzleStatus = () => {
    let cells = document.querySelectorAll("#theGame td");
    // Track correctly toggled and clicked cells
    let clickedAndCorrect = 0;
    let totalTogglableCells = 0;
    // Track the number of clicked cells
    let clickedCells = 0;

    // Loop to count togglable cells and also clicked & correctly toggled cells
    cells.forEach(cell => {
        // Check if the cell can be toggled
        if (cell.getAttribute("data-can-toggle") === "true") {
            totalTogglableCells++;
            
            // Keep track of the cells that have been clicked
            if (cell.getAttribute("data-clicked") === "true") {
                clickedCells++;
                
                // Check if the clicked cell is in the correct state
                if (cell.getAttribute("data-current-state") === cell.getAttribute("data-correct-state")) {
                    clickedAndCorrect++;
                }
            }
        }
    });

    //based on the results of the loop display a message
    if(clickedAndCorrect === totalTogglableCells && clickedCells === totalTogglableCells) {
        alert("You did it!!");
    } else if(clickedCells > 0 && clickedCells === clickedAndCorrect) {
        alert("So far so good");
    } else if(clickedCells > 0 && clickedAndCorrect < totalTogglableCells) {
        alert("Something is wrong");
    } else {
        alert("Make your first move!");
    }
}


const showIncorrectSquares = (show) => {
    let cells = document.querySelectorAll("#theGame td");
    let neutralCell = "0";
    cells.forEach(cell => {
        if(cell.getAttribute("data-can-toggle") === "true") {
            let currentState = cell.getAttribute("data-current-state");
            let correctState = cell.getAttribute("data-correct-state");

            // Check if the cell has been changed from its original state AND is incorrect
            if(currentState !== neutralCell && currentState !== correctState) {
                if(show) {
                    cell.style.border = "2px solid red";
                } else {
                    cell.style.border = "";
                }
            }
        }
    });
}

const restartGame = () => {
    // Clear the current game board
    document.querySelector("#theGame").innerHTML = "";

    processAPIResults(originalGameState);
}

const addElements = () => {
    var uiContainer = document.createElement("div");
    uiContainer.id = "uiContainer";

    // Create a button element for check
    var btnCheck = document.createElement("button");
    btnCheck.textContent = "Check";

    //Create a button element for restart
    var btnRestart = document.createElement("button");
    btnRestart.textContent = "Restart";

    // Create a checkbox for showing incorrect squares
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "showIncorrect";

    // Create a label for the checkbox
    var label = document.createElement("label");
    label.htmlFor = "showIncorrect";
    label.appendChild(document.createTextNode(" Show Incorrect Squares"));

    // add an event listener to the check button
    btnCheck.addEventListener("click", () => {
        checkPuzzleStatus();
    });

    btnRestart.addEventListener("click", () => {
        restartGame();
    });

    checkbox.addEventListener("change", (event) => {
        if(event.target.checked) {
            showIncorrectSquares(true);
        } else {
            showIncorrectSquares(false);
        }
    });

    // Append the newly created elements to the body or another specific element on the page
    uiContainer.appendChild(btnCheck);
    uiContainer.appendChild(btnRestart);
    uiContainer.appendChild(checkbox);
    uiContainer.appendChild(label);

    targetDiv.after(uiContainer);
};


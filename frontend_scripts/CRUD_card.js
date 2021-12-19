//First we get all our elements from our DOM and save it to constants.

const createCardForm = document.getElementById("create-card-form");
const todaysDateInput = document.getElementById("todays-date-input");
const createCardTextareaInput = document.getElementById("create-card-textarea-input");
const colorInput = document.getElementById("color-input");
const cardTable = document.getElementById("cardTable");

//API-Call-------------CREATE MANTRA-------------------

/* 
We add an event-listener with a callback function that triggers whenever the user clicks
on the submit button for the createCardForm.
*/
createCardForm.addEventListener("submit", async function(event){
  //The first thing that happens inside the callback function is that we prevent a lot of unnecessary things that usually happens. 
  event.preventDefault();
    
  //We will make a POST request to our api endpoint newmantra.
  //What we send is a JSON containing the date, text and color for the mantra.
  const response = await fetch("http://localhost:5000/api/newmantra",
   {
    method: "post",
    body: JSON.stringify({
      date: todaysDateInput.value,
      mantraText: createCardTextareaInput.value,
      cardColor: colorInput.value,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });

  //The JSON body of the API response is saved to a constant data
  const data = await response.json();

  //The body contains a message. That message has a flag msgError. We use
  //this flag to determine whether to alert success or failure.
  if (data.message.msgError === false) {
    alert("Ditt mantra är nu skapat! Kolla i din Mantra Lista!");
  } else {
    alert("Något gick fel! Vänligen fyll i alla fälten och prova igen...");
  }  
});

//API-Call-------------GET ALL THE MANTRAS-------------------

//This function is responsible for reading (the R in CRUD) all mantras
//and presenting them in a table
async function getCards() {
  /*Before we can add new rows to our table, we must make sure to clear the table
    Consider the follow table:
    - Row 1: Mantra A
    - Row 2: Mantra B
    When reading all mantras again and presenting them we want them to appear the same.
    Without the table clearing logic the table would look like this:
    - Row 1: Mantra A
    - Row 2: Mantra B
    - Row 1: Mantra A
    - Row 2: Mantra B
  */
  const mantraTableRows = document.querySelectorAll(".mantra-table-row");
  mantraTableRows.forEach(mantraTableRow => {
    cardTable.removeChild(mantraTableRow);
  });

  //We perform a GET request to get all our mantras and we save them into a constant called response.
  const response = await fetch("http://localhost:5000/api/getmantras");
  //We are only interested in the JSON body
  const responseBody = await response.json();

  //The logic for creating HTML elements is in its own function.
  //The JSON body itself contains only an array representing all the mantras.
  createCardTable(responseBody.mantras);
}

function createCardTable(mantras) {
  //Here we loop through our mantra objects and create a table rows.
  mantras.map((mantra, index) => {
    const tr = document.createElement("tr");
    /*Giving each row a classname simplifies the targeting when clearing the table.
      Imagine if the HTML page had multiple tables and our clearing function
      targeted all tr elements (document.getElementsByTagName('tr')), then we would remove
      too many elements. With a classname we can make sure we only remove relevant rows
      using document.querySelector(.mantra-table-row)
    */
    tr.className = "mantra-table-row";

    //Each row has a date input
    const tdDate = document.createElement("td");
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = mantra.date;
    tdDate.appendChild(dateInput);

    //Each row has a text input
    const tdMantraText = document.createElement("td");
    const mantraTextInput = document.createElement("input");
    mantraTextInput.value = mantra.mantraText;
    mantraTextInput.id="yada";
    tdMantraText.appendChild(mantraTextInput);

    //Each row has a color picker input
    const tdCardColor = document.createElement("td");
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = mantra.cardColor;
    tdCardColor.appendChild(colorInput);

    //Each row has an icon button to update a mantra. Clicking this button
    //will trigger a callback function which then calls our updateMantra function
    const tdCardUpdate = document.createElement("td");
    tdCardUpdate.addEventListener("click", function() {
      updateMantra(index, mantra);
    });
    const iCardUpdate = document.createElement("i");
    iCardUpdate.className ="fa fa-pencil";
    iCardUpdate.ariaHidden = true;

    //Each row has an icon button to delete a mantra. Clicking this button
    //will trigger a callback function which then calls our deleteMantra function
    const tdCardDelete = document.createElement("td");
    tdCardDelete.addEventListener("click", function() {
      deleteMantra(mantra);
    });
    const iCardDelete = document.createElement("i");
    iCardDelete.className="fa fa-trash";
    iCardDelete.ariaHidden = true;

    //Each row has an icon button to send a mantra by email. Clicking this button
    //will trigger a callback function which then calls our sendMantra function
    const tdCardSendEmail = document.createElement("td");
    tdCardSendEmail.addEventListener("click", function() {
      sendMantra(mantra);
    });
    const iCardSendEmail = document.createElement("i");
    iCardSendEmail.className="fa fa-envelope-o";
    iCardSendEmail.ariaHidden = true;

    //Here we set all the relations to our elements.
    tr.appendChild(tdDate);
    tr.appendChild(tdMantraText);
    tr.appendChild(tdCardColor);
    tdCardUpdate.appendChild(iCardUpdate);
    tdCardDelete.appendChild(iCardDelete);
    tdCardSendEmail.appendChild(iCardSendEmail);
    tr.appendChild(tdCardUpdate);
    tr.appendChild(tdCardDelete);
    tr.appendChild(tdCardSendEmail);
    cardTable.appendChild(tr);
  });
}

//The update function knows which mantra we are about to update and also
//which row index this mantra has in the table
async function updateMantra(index, mantra) {
  const tableRows = document.querySelectorAll(".mantra-table-row");
  //Using the index parameter, we can get the correct row and retrieve the 
  //date, text and color from each input respectively
  const tableRow = tableRows[index];
  const newDate = tableRow.cells[0].children[0].value;
  const newMantraText = tableRow.cells[1].children[0].value;
  const newColor = tableRow.cells[2].children[0].value;
  
  //Using the mantra parameter, we know what mantra ID to use as a parameter
  //when sending the PUT request to our API.
  //Our request body will contain a JSON representing the modified mantra
  const response = await fetch(
    "http://localhost:5000/api/updatemantra/" + mantra._id,
    {
      method: "put",
      body: JSON.stringify({
        date: newDate,
        mantraText: newMantraText,
        cardColor: newColor,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    }
  );
  const data = await response.json();
  //We finish off by alerting the user depending on the response message
  //as described earlier
  if (data.message.msgError === false) {
    alert("Mantrat är nu uppdaterat och sparat i listan!");
  } else {
    alert("Något gick fel! Vänligen försök igen...");
  }
}

async function deleteMantra(mantra) {
  //Pretty straight forward. We use the mantra parameter to get the mantra ID.
  //This ID is used as a parameter when creating the DELETE request
  const response = await fetch(
    "http://localhost:5000/api/deletemantra/" + mantra._id,
    {
      method: "delete"
    }
  );
  const data = await response.json();
  
  if (data.message.msgError === false) {
    alert("Mantrat är nu borttaget från din lista!");
  } else {
    alert("Något gick fel! Vänligen försök igen...");
  }

  //We finish off this time by re-rendering our table. If not, our deleted mantra
  //will still appear in the table which is misleading since it's removed from the MongoDB
  getCards();
}

/*
  Sending a mantra must also make use of our API. Our email service is part of our
  Node server (backend). Hence we can't reach it since we currently are in the frontend.
  Thus we have to go through our API. 
*/
async function sendMantra(mantra) {
  alert("Nu är ditt mantra skickat!")
  //We make a POST request to our API. The content is a JSON containing the mantra
  const response = await fetch("http://localhost:5000/api/sendmantra",
   {
    method: "post",
    body: JSON.stringify({
      date: mantra.date,
      mantraText: mantra.mantraText,
      cardColor: mantra.cardColor,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
}
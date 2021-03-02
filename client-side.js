// client-side js, loaded by index.html

/* function sends inputted data to server */
function save(input) {
  
  // create object data containing the equation
  // and the time that it was saved
  let d = new Date();
  let time = d.getTime(input);
  let calc = input
  let data = {time,calc}
  // create data type to send as JSON
  let options = {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body : JSON.stringify(data),
  };
  // send data and put the response into the list
  fetch('/sendCalculations', options).then(response => response.json()).then(
    data => {updatePreviousCalculations(data)});

} 

/* -------------------------------------------- */

/* Function uses list data to refresh the list of calculations
in html */
function updatePreviousCalculations(list) {
  // remove inside of list
  let htmlList = document.getElementById("calculations")
  htmlList.innerHTML = "";
  
  // iterate through calculations and add them to the list
  for(let i = 0; i < list.length; i++) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(list[i].calc));
    htmlList.appendChild(li);
  }  
}

/* -------------------------------------------- */


/* Function allows you to fetch for some data from
  the server and input it into updatePreviousCalculations func */
function getData() {
  fetch('/getCalculations').then(response => response.json()).then(
    data => {updatePreviousCalculations(data)});
}

/* -------------------------------------------- */

/* Function clears all the data from the server */
function clearData() {
  fetch('/clearData').then(response => response.json()).then(
    data => {updatePreviousCalculations(data)});
}

/* -------------------------------------------- */

// fetches data every 2 seconds
getData();
setInterval(getData, 2000);
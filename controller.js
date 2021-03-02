/* Set of functions that control the html element in order to build
  the expression using the calculator */

let fontSize = 9; // var holding fontsize of calculator display in vh
let clear = true; // fi true adding a charchter replaces entire display

/* Adds a charachter to the string containg the  */
function addChar(input) {
  var current = document.getElementById("calcDisplay").innerHTML;
  // if clear reset font size and clear display string
  if(clear) {
    fontSize = 9;
    document.getElementById("calcDisplay").style.fontSize = fontSize.toString() + "vh";
    current = '';
    clear = false;
  }
  
  // add char to current display
  document.getElementById("calcDisplay").innerHTML = current + input;

  /* Code dynamically adjusts font-size as expression overflows screen */
  let element = document.getElementById("calcDisplay")
  
  if(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
    if(fontSize > 3) {
      fontSize -= 1
      element.style.fontSize = fontSize.toString() + "vh"
    }
    else {
      document.getElementById("calcDisplay").innerHTML = current
    }
  }
}

/* ------------------------------------------------ */

// function called by equal sign on calculator
function equal() {
  let current = document.getElementById("calcDisplay").innerHTML;
  
  // use equals function in calculator.js to get the answer
  // and display to screen
  let answer = equals(current);
  document.getElementById("calcDisplay").innerHTML = answer;

  //set fontsize on display to maximum font-size without overflow
  let element = document.getElementById("calcDisplay");
  fontSize = 9;
  element.style.fontSize = fontSize.toString() + "vh";

  while(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
    
    fontSize -= 1
    element.style.fontSize = fontSize.toString() + "vh"  
  }

  //since dsiplay shows answer mark it for clearing
  clear = true;
  
  // use save function in client-side.js to send equationto server
  save(current + ' = ' + answer);

}

/* ------------------------------------------------ */

/* simple function to delete chars from screen */
function del() {
  
  let current = document.getElementById("calcDisplay").innerHTML;
  
  //if it is an operator delete 3 chars
  if(current.slice(-1) == " ") {
    document.getElementById("calcDisplay").innerHTML = current.substring(0,current.length - 3);
  }
  //if its a normal char from number or decimal point just delete it
  else {
    document.getElementById("calcDisplay").innerHTML = current.substring(0,current.length - 1);
  }

  current = document.getElementById("calcDisplay").innerHTML;

  // if screen is to be cleared or  display empty then put 0 and set
  // clear to true
  if(current == "" || clear) {
    document.getElementById("calcDisplay").innerHTML = "0"
    clear = true;
  }

  //set fontsize on display to maximum font-size without overflow
  let element = document.getElementById("calcDisplay");
  fontSize = 9;
  element.style.fontSize = fontSize.toString() + "vh";

  while(element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth) {
    
    fontSize -= 1
    element.style.fontSize = fontSize.toString() + "vh"  
  }
}


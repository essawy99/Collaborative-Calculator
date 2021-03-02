/* High-Level flow of code
   equals (Also do error checking)->
   calculate ->
   addSub ->
   addSubHelper ->
   mulDiv ->
   compute

   This is not an incredibly accurate representation
   as other functions rely on compute but I want
   to make it easier to follow the code

*/


/* This function is the only function called outside of calculate.js
   you give the function a string and it computes it into the answer */
function equals(string) {

  // split string into array by spaces
  let array = string.split(' ');
  
  // remove any empty elements form array
  // caused by double spaces
  let processed = [];
  for(let i = 0; i < array.length; i++) {
    if(array[i] != "") {
      processed.push(array[i]);
    }
  }
  
  // error check for valid parentheses, 
  // valid numbers and valid Expressions
  let paraOkay = countParentheses(processed);
  let validNumbers = validNumber(processed);
  let validExpression = validateExpression(processed);
  
  let answer = '';
  // check parentheses errors
  if(paraOkay != '-') {
    answer =paraOkay;
  }
  // check for invalid number errors
  else if(validNumbers != '-') {
    answer = validNumbers;
  }
  // check for invalid expression errors
  else if(validExpression != '-') {
    answer = validExpression
  }
  // otherwise calculate the answer
  else {
    answer = calculate(processed);
    // check for divide by zero errors
    if (answer == 'Infinity') {
      answer = 'DIVIDE BY 0 ERROR'
    }
  }
  // if there are no errors return the answer
  return answer;
  
}
/* ------------------------------------------------------- */

/* first part of real calculations, we recursively calculate 
everything within the first set of parentheses until no
more parentheses. Then we calculate the leftover expression
using addSub*/
function calculate(array) {
  let prePara = [];  // everything before first parentheses
  let inPara = []; // everything within the first set of parentheses
  let postPara = []; // everything after the first set of parentheses

  i = 0
  // fills prepara until it hits a (
  for(; i < array.length; i++) {
    if(array[i] == '(') {
      i++;
      break
    }
    else {
      prePara.push(array[i]);
    }
  }
  
  //fills  inPara until it hits matching )
  let numOut = 0;
  for(; i < array.length; i++) {
    if(array[i] == ')' && numOut == 0) {
      i++;
      break;
    }
    else {
      if(array[i] == '(') {
        numOut++;
      }
      if(array[i] == ')') {
        numOut--;
      }
      inPara.push(array[i]);
    }  
  }

  // fill postpera until the end of the array
  for(; i < array.length; i++) {
    postPara.push(array[i]);
  }  
  
  //if there is no parentheses calculate rest
  if(inPara.length == 0 && postPara.length == 0) {
    return addSub(prePara)
  }
  
  //
  else {
    
    // calculate what is within parentheses
    let answer = calculate(inPara);
    // create new array replacing parentheses withcomputed value
    prePara.push(answer);
    let newArray = prePara.concat(postPara)
    // calculate the new array
    return calculate(newArray)
  }

}

/* --------------------------------------------------------- */

/* This function takes an array and splits it by 
    addition and subtraction operators 
    Ex: [1, +, 2, * 3, - 4] becomes 
        [[1], [+], [2, *, 3], [+] , [4]] */
function addSub(array) {
  let currentExpression = [];
  let totalExpression = [];
  for(var i = 0; i < array.length; i++) {
    // when operator is reached push current expression
    // and operator to total expression
    if(array[i] == '+' || array[i] == '-') {
      totalExpression.push(currentExpression);
      totalExpression.push([array[i]]);
      currentExpression = [];
    }
    // otherwise grow current expression
    else {
      currentExpression.push(array[i]);
    }
  }
  // add final ecpression
  totalExpression.push(currentExpression);

  // once array is plit by +/- operators feed
  // into the addSubHelper
  return addSubHelper(totalExpression)

}

function addSubHelper(array) {
    // find how many operations need to be done
    let operations = (array.length -1) / 2
  
    // initialize the total to be first element
    let total = mulDiv(array[0])
  
    // compute total */ the next number to be operated on
    for(let i = 0; i < operations; i++) {
      total = compute(total, array[2*i+1], mulDiv(array[2*i+2]))
    }
  
    return total
}

/* ------------------------------------------------------------ */


/* function takes in string of multplication and divisions
   and computes them */
   function mulDiv(array) {
    for(let i = 0; i <(array.length -1); i++) {
      // if you have two numbers in a row like in 8(10)
      // multiply them, shrink the array and restart the loop
      if(!isOperator(array[i]) && !isOperator(array[i+1])) {
        let product = parseFloat(array[i]) * parseFloat(array[i+1]) 
        array[i+1] = product.toString();
        array.splice(i,1);
        i = -1;
      }
    }
    
    // find how many operations need to be done
    let operations = (array.length -1) / 2
    
    // initialize the total to be first element
    let total = array[0]
  
    // compute total */ the next number to be operated on
    for(let i = 0; i < operations; i++) {
      total = compute(total, array[2*i+1], array[2*i+2])
    }
    return total
  }

/* ------------------------------------------------------------ */

/* Simple function that takes 2 numbers and an operator
   to compute a number, then it returns a string of that number*/
function compute(arg1, operator, arg2) {
  // converts to float does operation then
  // returns string of answer
  if(operator == '+') {
    result = parseFloat(arg1) + parseFloat(arg2);
    return result.toString();
  }
  else if(operator == '-') {
    result = parseFloat(arg1) - parseFloat(arg2);
    return result.toString();
  }
  else if(operator == '*') {
    result = parseFloat(arg1) * parseFloat(arg2);
    return result.toString();
  }
  else if (operator == '÷') {
    result = parseFloat(arg1) / parseFloat(arg2);
    return result.toString();
  }
}


/* ----------------ERROR CHECKERS------------------ */

function countParentheses(array) {

  let count = 0

  // increment count when you reach open parentheses
  // decrement count at closed parentheses
  for(var i = 0; i < array.length; i++) {
    if(array[i] == '(') {
      count++;
    }
    if(array[i] == ')') {
      count--;
    }
     // if count below 0 means we have something like ())
    if(count < 0) {
      return 'ERROR: CLOSED PARENTHESES BEFORE OPENING'
    }
  }

  // if count = 0 it means equal number of open and closed parentheses
  if(count == 0) {
    return '-'
  }
  // if not send error message
  else {
    return 'ERROR: UNCLOSED PARENTHESES'
  }
}

/* -------------------------------------------------- */

/* Checks for the vailidity of numbers */
function validNumber(array) {
  for(let i = 0; i < array.length; i++) {
    // skips non-numbers
    if(array[i] == '+' || array[i] == '-' || array[i] == '*' || 
    array[i] == '÷' || array[i] == '(' || array[i] == ')' ) {
    }
    else {
      // turn number into an array of characters
      let numbers = array[i].split("")
      //check for negative sign in the middle of number
      for(let j = 1; j < numbers.length; j++) {
        if(numbers[j] == '-') {
          return ('INVALID NUMBER : ' + array[i]) 
        }
      }
      // find how many . in number
      let decCount = 0
      for(let j = 0; j < numbers.length; j++) {
        if(numbers[j] == '.') {
          decCount++;
        }
      }
      // if we have more then 1 point there is an error
      if(decCount > 1) {
        return ('INVALID NUMBER : ' + array[i]) 
      }
    }
  }
  //otherwise '-' means all good
  return '-'
}

/* -------------------------------------------------- */

/* Checks the validity of operators beinf used */
function validateExpression(array) {
  // check for two consequtive operators
  for(let i = 0; i < (array.length -1); i++) {
    if(isOperator(array[i]) && isOperator(array[i+1])) {
      return 'INVALID EXPRESSION : TWO OPERATIONS IN A ROW';
    }
  }
  //checks for operator directly on the inside of parentheses
  // and empty parentheses
  for(let i = 0; i < (array.length -1); i++) {
    if(array[i] == '(' && isOperator(array[i+1])) {
      return 'SYNTAX ERROR : NO OPERATORS DIRECTLY TO THE RIGHT OF ( ';
    }
    if(isOperator(array[i]) && array[i+1] == ')') {
      return 'SYNTAX ERROR : NO OPERATORS DIRECTLY TO THE LEFT OF ) ';
    }
    if(array[i] == '(' && array[i+1] == ')') {
      return 'ERROR : EMPTY PARENTHESES';
    }
  }
  
  // checks for an expression that begins or ends with an operator
  if(isOperator(array[0]) || isOperator(array[array.length -1])) {
    return 'SYNTAX ERROR : CANNOT BEGIN OR END EXPRESSION WITH OPERATOR'
  }
  
  // if all tests pass return '-'
  return '-'

}

/* Simple Helper functions that checks if a string is an operator */
function isOperator(char) {
  if(char == '+' || char == '-' || char == '*' || 
    char == '÷' ) {
      return true;
  }
  else {
      return false;
  }
}



/*
In JavaScript, a closure is the combination of a function (Higher Order Function) 
and the lexical environment within which that function was declared. 
This means that a closure allows an inner function to access variables 
from its outer (enclosing) function's scope, 
even after the outer function has finished executing. 
*/
function sayHello() {
  let name = "SPRK";

  function sayGreet() {
    console.log(`Welcome ${name}`);
  }

  return sayGreet;
}

let fnCall = sayHello();

console.log(fnCall);

fnCall();
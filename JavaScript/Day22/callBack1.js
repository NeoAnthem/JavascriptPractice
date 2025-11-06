setTimeout(function () {
  console.log("Hello All I am first time out");
}, 2000);
setTimeout(function () {
  console.log("Hello All I am second time out");
}, 2000);

// SetTime out is not handle by Js but handle by browser -> bcoz of c++

console.log("Hello From Outside");

// Callback hell
// Phle 1st chale complete then run 2nd

// we can create nested callbacks
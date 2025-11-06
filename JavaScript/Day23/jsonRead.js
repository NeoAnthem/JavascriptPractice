let apiResponse =
  '[{"quote": "The road to success begins with knowing what you need to know and why", "author": "Savania China", "work": "", "categories": ["success", "wisdom", "inspirational"]}]';

console.log(apiResponse);
console.log(typeof apiResponse);

// convert String to Object
let apiRespObj = JSON.parse(apiResponse);
console.log(apiRespObj);
console.log(typeof apiRespObj);

apiObject = apiRespObj[0];

console.log(apiObject);
console.log(apiObject.quote);

/*
Data send -> object -> json
*/

let student = {
  name: "Abdul Gani",
  age: 25,
};
console.log(student);
console.log(typeof student);

console.log("Object to JSON");
console.log(JSON.stringify(student));
console.log(typeof JSON.stringify(student));

// fetch, axios
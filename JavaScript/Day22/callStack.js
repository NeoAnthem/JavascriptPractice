function addition() {
  let result = sumOfTwo() + sumOfOne();

  console.log(result);
}

function sumOfOne() {
  return 1;
}
function sumOfTwo() {
  return sumOfOne() + sumOfOne();
}

addition();
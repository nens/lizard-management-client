function doArraysHaveEqualElement(arr1, arr2) {
  return arr1.some((item) => arr2.includes(item));
}

export default doArraysHaveEqualElement;

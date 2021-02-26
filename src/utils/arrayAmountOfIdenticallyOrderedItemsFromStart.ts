const arrayAmountOfIdenticallyOrderedItemsFromStart = function (arr1:string[], arr2:string[]) {
  let i = 0;
  let equalItems = 0;
  let foundDifference = false
  while (!foundDifference && arr1.length > i) {
    i++;
    if (arr1[i] === arr2[i]) {
      equalItems++;
    } else {
      foundDifference = true;
    }
  }
  return equalItems;
}

export default arrayAmountOfIdenticallyOrderedItemsFromStart;
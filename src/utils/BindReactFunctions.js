// TODO make working with react
function bindReactFunctions(obj) {
  for (var key in obj) {
    if (/*obj.hasOwnProperty(key) && */ typeof obj[key] === "function") {
      obj[key] = obj[key].bind(obj);
    }
  }
}

export default bindReactFunctions;

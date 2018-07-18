// TODO make working with react
function bindReactFunctions(obj) {
  for (var key in obj) {
    console.log("tessst", key);
    if (/*obj.hasOwnProperty(key) && */ typeof obj[key] === "function") {
      console.log("obj[key]", typeof obj[key], key);
      obj[key] = obj[key].bind(obj);
    }
  }
}

export default bindReactFunctions;

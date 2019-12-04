export const getLocalStorage = function (name, defaultValue) {
    const localStorageResult = localStorage.getItem(name);
    if (!localStorageResult) {
      return defaultValue;
    }
    let result;
    try {
      result = JSON.parse(localStorageResult);
    } catch(e) {
        return defaultValue;
    }
    return result;
}
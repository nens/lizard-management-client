import { useSelector } from "react-redux";

interface Input {
  selectorArray: any[]
}

interface Output {
  allLoaded: boolean
}

export const getAllSelectorsTruthy = ({ selectorArray }: Input): Output => {

  const appliedSelectors = selectorArray.map(selector=>useSelector(selector));

  if (appliedSelectors.every(item=>item)) {
    return {
      allLoaded: true, 
    }
  } else {
    return {
      allLoaded: false, 
    }
  }
  
};
export default getAllSelectorsTruthy;
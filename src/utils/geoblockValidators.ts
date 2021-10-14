import { Elements, isNode, Node } from "react-flow-renderer";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const geoBlockValidator = (elements: Elements) => {
  const rasterElements = elements.filter(el => isNode(el) && el.type === 'RasterBlock') as Node[];

  let errors: {
    blockId: string,
    errorMessage: string
  }[] = [];

  rasterElements.forEach(el => {
    const rasterError = uuidValidator(el);
    if (rasterError) errors.push(rasterError);
  });

  return errors;
};

const uuidValidator = (el: Node) => {
  const uuid = el.data!.value;
  if (!uuidRegex.test(uuid)) {
    return {
      blockId: el.id,
      errorMessage: `UUID of ${el.data!.label} is not valid`
    };
  };
  return false;
};
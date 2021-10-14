import { Elements, isNode, Node } from "react-flow-renderer";

interface ErrorObject {
  blockId?: string,
  errorMessage: string
}

type Error = ErrorObject | false;

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const geoBlockValidator = (elements: Elements): ErrorObject[] => {
  const rasterElements = elements.filter(el => isNode(el) && el.type === 'RasterBlock') as Node[];
  const outputBlocks = elements.filter(el => isNode(el) && el.data && el.data.outputBlock) as Node[];

  let errors: ErrorObject[] = [];

  rasterElements.forEach(el => {
    const rasterError = uuidValidator(el);
    if (rasterError) errors.push(rasterError);
  });

  const outputError = outputValidator(outputBlocks);
  if (outputError) errors.push(outputError);

  return errors;
};

const uuidValidator = (el: Node): Error => {
  const uuid = el.data!.value;
  if (!uuidRegex.test(uuid)) {
    return {
      blockId: el.id,
      errorMessage: `UUID of ${el.data!.label} is not valid.`
    };
  };
  return false;
};

const outputValidator = (outputBlocks: Node[]): Error => {
  if (outputBlocks.length > 1) {
    return {
      errorMessage: 'Only one output block is allowed.'
    };
  } else if (outputBlocks.length === 0) {
    return {
      errorMessage: 'No output block.'
    };
  };
  return false;
};
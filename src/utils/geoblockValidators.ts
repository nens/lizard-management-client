import { storeDispatch } from "..";
import { addNotification } from "../actions";
import { GeoBlockSource } from "../types/geoBlockType";
import {
  Connection,
  Edge,
  Elements,
  getOutgoers,
  isEdge,
  isNode,
  Node
} from "react-flow-renderer";

interface ErrorObject {
  errorMessage: string
}

type Error = ErrorObject | false;

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const dryFetchGeoBlockForValidation = (uuid: string | null, source: GeoBlockSource | null) => {
  fetch(`/api/v4/rasters/${uuid || "db90664c-57fd-4ece-b0a6-ffa34b0e9b2f"}/?dry-run`, {
    credentials: 'same-origin',
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: source ? JSON.stringify({ source }) : null
  })
  .then(res => res.json())
  .then(res => {
    if (res.status === 400) {
      console.error(res.detail && res.detail.source && res.detail.source[0]);
      const errorMessage = res.detail && res.detail.source && res.detail.source[0];
      if (errorMessage) {
        storeDispatch(addNotification(errorMessage))
      } else {
        storeDispatch(addNotification('Unknown error!'))
      };
    } else if (res.status === 500) {
      console.error(res.message);
      storeDispatch(addNotification(500));
    } else if (res.id) { // valid response
      console.log(res);
      storeDispatch(addNotification('The GeoBlock is valid.', 2000));
    } else {
      console.error(res);
      storeDispatch(addNotification('Unknown error!'));
    };
  });
};

export const geoBlockValidator = (elements: Elements): ErrorObject[] => {
  const rasterElements = elements.filter(el => isNode(el) && el.type === 'RasterBlock') as Node[];
  const buildingBlocks = elements.filter(el => isNode(el) && el.type !== 'RasterBlock');
  const outputBlocks = elements.filter(el => isNode(el) && getOutgoers(el, elements).length === 0);

  let errors: ErrorObject[] = [];

  rasterElements.forEach(el => {
    const rasterError = uuidValidator(el);
    if (rasterError) errors.push(rasterError);
  });

  const outputError = outputValidator(outputBlocks);
  if (outputError) errors.push(outputError);

  const blockError = blockInutValidator(buildingBlocks);
  if (blockError) errors.push(blockError);

  return errors;
};

const uuidValidator = (el: Node): Error => {
  const uuid = el.data!.value;
  if (!uuidRegex.test(uuid)) {
    return {
      errorMessage: `UUID of ${el.data!.label} is not valid.`
    };
  };
  return false;
};

const outputValidator = (outputBlocks: Elements): Error => {
  if (outputBlocks.length > 1) {
    return {
      errorMessage: 'More than one output block existed in the graph.'
    };
  } else if (outputBlocks.length === 0) {
    return {
      errorMessage: 'No output block.'
    };
  };
  return false;
};

const blockInutValidator = (blocks: Elements): Error => {
  const blocksWithInvalidInput = blocks.filter(block => {
    const parameters = block.data.parameters as any[];

    // invalid inputs include following values: undefined, NaN, empty string
    // or a string starts with 'handle-'
    return (
      parameters.length === 0 ||
      parameters.includes(undefined) ||
      parameters.includes(NaN) ||
      parameters.includes('') ||
      !!parameters.find(parameter => typeof(parameter) === 'string' && parameter.includes('handle-'))
    );
  });

  if (blocksWithInvalidInput.length > 0) {
    return {
      errorMessage: `${blocksWithInvalidInput.map(block => block.data.label).join(', ')} contain invalid inputs.`
    };
  };
  return false;
};

export const targetHandleValidator = (els: Elements, params: Edge | Connection): Error => {
  const target = els.find(el => el.id === params.target)!;
  const targetHandle = params.targetHandle!;

  // check if another edge has been connected to the target
  const edges = els.filter(el => isEdge(el)) as Edge[];
  const existingEdge = edges.find(edge => edge.target === target.id && edge.targetHandle === targetHandle);

  if (existingEdge) {
    return {
      errorMessage: 'Target handle has been used by another block.'
    };
  };

  return false;
};
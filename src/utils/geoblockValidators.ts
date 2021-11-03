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
  blockId?: string,
  errorMessage: string
}

type Error = ErrorObject | false;

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const dryFetchGeoBlockForValidation = (uuid: string | null, source: GeoBlockSource) => {
  fetch(`/api/v4/rasters/${uuid || "db90664c-57fd-4ece-b0a6-ffa34b0e9b2f"}/?dry-run`, {
    credentials: 'same-origin',
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source })
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    if (res.status === 400) {
      console.error(res.detail && res.detail.source && res.detail.source[0]);
      const errorMessage = res.detail && res.detail.source && res.detail.source[0];
      if (errorMessage) {
        storeDispatch(addNotification(errorMessage))
      } else {
        storeDispatch(addNotification('Unknown error! Something is wrong with the GeoBlock.'))
      };
    } else if (res.id) { // valid response
      storeDispatch(addNotification('The GeoBlock is valid.', 2000));
    };
  });
};

export const geoBlockValidator = (elements: Elements): ErrorObject[] => {
  const rasterElements = elements.filter(el => isNode(el) && el.type === 'RasterBlock') as Node[];
  const outputBlocks = elements.filter(el => isNode(el) && getOutgoers(el, elements).length === 0);

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
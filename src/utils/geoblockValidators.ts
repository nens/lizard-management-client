import { Connection, Edge, Elements, getOutgoers, isEdge, isNode, Node } from "react-flow-renderer";
import { GeoBlockSource, geoblockType } from "../types/geoBlockType";

interface ErrorObject {
  blockId?: string,
  errorMessage: string
}

type Error = ErrorObject | false;

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const fetchGeoBlock = (uuid: string | null, source: GeoBlockSource) => {
  fetch(`/api/v4/rasters/${uuid || "db90664c-57fd-4ece-b0a6-ffa34b0e9b2f"}/?dry-run`, {
    credentials: 'same-origin',
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source })
  })
  .then(res => res.json())
  .then(res => console.log(res))
};

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

  const orphanPartError = orphanPartValidator(elements);
  if (orphanPartError) errors.push(orphanPartError);

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

const orphanPartValidator = (els: Elements): Error => {
  const blocks = els.filter(
    el => isNode(el)
  ).filter(
    el => !(el.type === 'NumberBlock')
  ).filter(
    el => !el.data.outputBlock
  ) as Node[];

  const orphanBlock = blocks.find(block => {
    const outgoers = getOutgoers(block, els);
    return outgoers.length === 0;
  });

  if (orphanBlock) {
    return {
      blockId: orphanBlock.id,
      errorMessage: 'Orphan part existed in the graph.'
    };
  };

  return false;
};

export const targetHandleValidator = (els: Elements, params: Edge | Connection): Error => {
  const source = els.find(el => el.id === params.source)!;
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

  // check if input block and the target handle have the same data type
  const valueTypeOfSource = (
    source.type === 'NumberBlock' ? 'number' :
    source.type === 'BooleanBlock' ? 'boolean' :
    source.type === 'StringBlock' ? 'string' :
    'raster_block'
  );

  const targetBlockParameters = Object.values(geoblockType).find(blockType => blockType!.class === target.data!.classOfBlock)!.parameters;

  const targetHandlers: {[key: string]: string | string[]} = {};

  let valueTypeOfTargetHandle: string | string[];

  if (Array.isArray(targetBlockParameters)) {
    targetBlockParameters.forEach((parameter, i) => {
      return targetHandlers['handle-' + i] = parameter.type;
    });
    valueTypeOfTargetHandle = targetHandlers[targetHandle];
  } else {
    valueTypeOfTargetHandle = 'raster_block';
  };

  // Not allowed to connect to a target handle with a wrong data type
  if (!valueTypeOfTargetHandle.includes(valueTypeOfSource)) {
    return {
      errorMessage: 'Invalid connection due to wrong data type.'
    };
  };

  return false;
};
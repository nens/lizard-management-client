import { storeDispatch } from "..";
import { addNotification } from "../actions";
import { GeoBlockSource } from "../types/geoBlockType";
import { Values } from "../form/useForm";
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

const handleGeoBlockValidationResponse = (res: any) => {
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
};

export const dryFetchGeoBlockForValidation = (
  uuid: string | null,
  source: GeoBlockSource | null,
  formValues: Values
) => {
  if (uuid) {
    fetch(`/api/v4/rasters/${uuid}/?dry-run`, {
      credentials: 'same-origin',
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: source && Object.keys(source).length ? source : null
      })
    })
    .then(res => res.json())
    .then(res => handleGeoBlockValidationResponse(res))
    .catch(console.error)
  } else {
    fetch('/api/v4/rasters/?dry-run', {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formValues.name,
        aggregation_type: formValues.aggregationType && formValues.aggregationType.value,
        observation_type: formValues.observationType && formValues.observationType.value,
        source: source && Object.keys(source).length ? source : null,
        access_modifier: formValues.access_modifier || 'Private',
        organisation: formValues.organisation && formValues.organisation.value,
      })
    })
    .then(res => res.json())
    .then(res => handleGeoBlockValidationResponse(res))
    .catch(console.error)
  };
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

  const blocksWithOnlyNumberOrBooleanInputs = blocks.filter(block => {
    const parameters = block.data.parameters as any[];

    // for blocks with 2 inputs of type [raster_block, number] or type [raster_block, boolean]
    // at least, one of the inputs must be a RasterBlock
    return (
      (parameters.length === 2 && typeof(parameters[0]) === 'boolean' && typeof(parameters[1]) === 'boolean') ||
      (parameters.length === 2 && typeof(parameters[0]) === 'number' && typeof(parameters[1]) === 'number')
    );
  });

  if (blocksWithInvalidInput.length > 0) {
    return {
      errorMessage: `${blocksWithInvalidInput.map(block => block.data.label).join(', ')} contain invalid inputs.`
    };
  } else if (blocksWithOnlyNumberOrBooleanInputs.length > 0) {
    return {
      errorMessage: `${blocksWithOnlyNumberOrBooleanInputs.map(block => block.data.label).join(', ')} must contain at least one RasterBlock.`
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
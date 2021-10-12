import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import { geoblockType } from '../../../../types/geoBlockType';

interface BlockInput {
  label: string,
  classOfBlock: string,
  parameters: (string | number | [])[],
  outputBlock?: boolean
}

export const Block = (props: Node<BlockInput>) => {
  const { label, classOfBlock, outputBlock } = props.data!;
  const block = Object.values(geoblockType).find(
    geoblock => geoblock && geoblock.class && geoblock.class === classOfBlock
  );

  if (!block) {
    console.error('No type definition for this block: ' + classOfBlock);
    return;
  };

  const { parameters } = block;
  const numberOfParameters = Array.isArray(parameters) && parameters.length;

  return (
    <>
      {Array.isArray(parameters) && parameters.map((parameter, i) => (
        <Handle
          key={i}
          type="target"
          id={'handle-' + i}
          title={parameter.name}
          position={Position.Left}
          style={{
            top: 10 * (i + 1),
            background: (
              parameter.type === 'raster_block' ? 'orange' :
              parameter.type === 'string' ? 'blue' :
              parameter.type === 'number' ? 'green' :
              undefined
            )
          }}
        />
      ))}
      <div
        style={{
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          // calculate the height of the block if there are more than 3 parameters
          height: numberOfParameters && numberOfParameters > 3 ? numberOfParameters * 10 : undefined
        }}
      >
        {label}
      </div>
      {!outputBlock ? (
        <Handle
          type="source"
          position={Position.Right}
        />
      ) : null}
    </>
  )
}
import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import { geoblockType } from '../../../../types/geoBlockType';
import styles from './Block.module.css';

interface BlockInput {
  label: string,
  classOfBlock: string,
  parameters: (string | number | [])[],
  outputBlock?: boolean,
  onOutputChange: (bool: boolean) => void
}

export const Block = (props: Node<BlockInput>) => {
  const { label, classOfBlock, outputBlock, onOutputChange } = props.data!;
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
    <div
      className={`${styles.Block} ${outputBlock ? styles.OutputBlock : ''}`}
      tabIndex={1}
    >
      {Array.isArray(parameters) && parameters.map((parameter, i) => (
        <Handle
          key={i}
          type="target"
          id={'handle-' + i}
          title={`${parameter.name}: ${parameter.type}`}
          position={Position.Left}
          style={{
            top: 10 * (i + 1),
            background: (
              parameter.type === 'raster_block' ? 'orange' :
              parameter.type === 'string' ? 'orange' :
              parameter.type === 'number' ? '#009f86' :
              parameter.type === 'boolean' ? 'green' :
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
        <span>{label}</span>
        <i
          className={outputBlock ? 'fa fa-plus' : 'fa fa-minus'}
          style={{
            cursor: 'pointer',
            marginLeft: 10
          }}
          onClick={() => onOutputChange(!outputBlock)}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          visibility: outputBlock ? 'hidden' : 'visible'
        }}
      />
    </div>
  )
}
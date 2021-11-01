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
  const { label, classOfBlock } = props.data!;
  const block = Object.values(geoblockType).find(
    geoblock => geoblock && geoblock.class && geoblock.class === classOfBlock
  );

  if (!block) {
    console.error('No type definition for this block: ' + classOfBlock);
    return;
  };

  const { parameters } = block;

  const rasterParameters = Array.isArray(parameters) ? parameters.filter(parameter => parameter.type.includes('raster_block')) : [];
  const otherParameters = Array.isArray(parameters) ? parameters.filter(parameter => parameter.type !== 'raster_block') : [];

  return (
    <div
      className={styles.Block}
      tabIndex={1}
    >
      {rasterParameters.map((parameter, i) => (
        <Handle
          key={i}
          type="target"
          id={'handle-' + i}
          title={`${parameter.name}: ${parameter.type}`}
          position={Position.Left}
          style={{
            top: 10 * (i + 1),
            background: 'orange',
          }}
        />
      ))}
      <div>
        <div
          className={styles.BlockHeader}
        >
          <h4>{label}</h4>
          <small><i>({classOfBlock})</i></small>
        </div>
        {otherParameters.map((parameter, i) => (
          <input
            type={'text'}
            title={parameter.name}
            placeholder={parameter.name}
            style={{
              width: '100%',
              marginTop: 10,
            }}
          />
        ))}
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}
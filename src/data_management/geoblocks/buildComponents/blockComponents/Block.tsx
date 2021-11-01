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
  const { label, classOfBlock, parameters } = props.data!;
  const block = Object.values(geoblockType).find(
    geoblock => geoblock && geoblock.class && geoblock.class === classOfBlock
  );

  if (!block) {
    console.error('No type definition for this block: ' + classOfBlock);
    return;
  };

  const blockParameters = block.parameters;
  const blockArrayParameters = Array.isArray(blockParameters) ? blockParameters : [];
  // const rasterParameters = blockArrayParameters.filter(parameter => parameter.type.includes('raster_block'));
  // const otherParameters = blockArrayParameters.filter(parameter => parameter.type !== 'raster_block');

  return (
    <div
      className={styles.Block}
      tabIndex={1}
    >
      {blockArrayParameters.map((parameter, i) => (
        parameter.type.includes('raster_block') ? (
          <Handle
            key={i}
            type="target"
            id={'handle-' + i}
            title={`${parameter.name}: ${parameter.type}`}
            position={Position.Left}
            style={{
              top: i === 0 ? 100 : (100 + i * 35),
              background: 'orange',
            }}
          />
        ) : null
      ))}
      <div>
        <div
          className={styles.BlockHeader}
        >
          <h4>{label}</h4>
          <small><i>({classOfBlock})</i></small>
        </div>
        {blockArrayParameters.map((parameter, i) => {
          return (
            <input
              type={'text'}
              className={styles.BlockInput}
              title={parameter.name}
              placeholder={parameter.name}
              defaultValue={parameters[i]}
              readOnly={parameter.type === 'raster_block'}
            />
          )
        })}
      </div>
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}
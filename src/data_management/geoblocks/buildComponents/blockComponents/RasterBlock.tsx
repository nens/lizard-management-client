import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import styles from './Block.module.css';

interface RasterBlockInput {
  label: string,
  classOfBlock: string
  value: string,
  onChange: (value: string) => void,
}

export const RasterBlock = (props: Node<RasterBlockInput>) => {
  const { label, classOfBlock, value, onChange } = props.data!;
  return (
    <div
      className={`${styles.Block} ${styles.RasterBlock}`}
      tabIndex={1}
    >
      <div
        className={styles.BlockHeader}
      >
        <h4>{label}</h4>
        <small><i>({classOfBlock})</i></small>
      </div>
      <input
        type={'text'}
        className={styles.BlockInput}
        title={value}
        placeholder={'Please enter an UUID'}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}
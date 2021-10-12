import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import styles from './Block.module.css';

interface RasterBlockInput {
  label: string,
  value: string,
  onChange: (value: string) => void,
}

export const RasterBlock = (props: Node<RasterBlockInput>) => {
  const { label, value, onChange } = props.data!;
  return (
    <div
      className={`${styles.Block} ${styles.RasterBlock}`}
      tabIndex={1}
    >
      <div className={styles.BlockLabel}>
        {label}
      </div>
      <input
        className={styles.BlockInput}
        type="text"
        onChange={e => onChange(e.target.value)}
        defaultValue={value}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}
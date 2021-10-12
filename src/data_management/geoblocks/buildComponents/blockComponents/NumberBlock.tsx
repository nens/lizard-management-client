import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import styles from './Block.module.css';

interface NumberBlockInput {
  value: number,
  onChange: (value: number) => void,
}

export const NumberBlock = (props: Node<NumberBlockInput>) => {
  const { value, onChange } = props.data!;
  return (
    <div
      className={`${styles.Block} ${styles.NumberBlock}`}
      tabIndex={1}
    >
      <input
        className={styles.BlockNumberInput}
        type="number"
        onChange={e => onChange(parseFloat(e.target.value))}
        defaultValue={value}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}
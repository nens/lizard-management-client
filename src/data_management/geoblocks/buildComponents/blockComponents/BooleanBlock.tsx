import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import styles from './Block.module.css';

interface BooleanBlockInput {
  value: boolean,
  onChange: (value: boolean) => void,
}

export const BooleanBlock = (props: Node<BooleanBlockInput>) => {
  const { value, onChange } = props.data!;
  return (
    <div
      className={`${styles.Block} ${styles.BooleanBlock}`}
      tabIndex={1}
    >
      <input
        className={styles.BlockNumberInput}
        type="checkbox"
        checked={value}
        onChange={() => onChange(!value)}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}
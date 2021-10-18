import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import formStyles from './../../../../styles/Forms.module.css';
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
      title={label}
      tabIndex={1}
    >
      <div className={styles.BlockLabel}>
        {label}
      </div>
      <input
        type="text"
        title={value}
        className={`${formStyles.FormControl} ${styles.BlockInput}`}
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
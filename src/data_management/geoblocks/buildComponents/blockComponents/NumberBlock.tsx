import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import formStyles from './../../../../styles/Forms.module.css';
import styles from './Block.module.css';

interface NumberBlockInput {
  value: number,
  onChange: (value: number) => void,
}

export const NumberBlock = (props: Node<NumberBlockInput>) => {
  const { value, onChange } = props.data!;
  return (
    <div>
      <input
        type="number"
        title={value.toString()}
        className={`${formStyles.FormControl} ${styles.NumberBlock}`}
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
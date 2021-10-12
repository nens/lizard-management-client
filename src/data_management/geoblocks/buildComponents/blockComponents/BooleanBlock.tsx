import React from 'react';
import { Handle, Node, Position } from 'react-flow-renderer';
import Checkbox from '../../../../components/Checkbox';
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
      <Checkbox
        name={''}
        checked={value}
        onChange={() => onChange(!value)}
        size={24}
        borderRadius={3}
        checkmarkColor={'#009f86'}
      />
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  )
}
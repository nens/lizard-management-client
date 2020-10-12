import React from 'react';
import styles from './Test.module.css';

interface TestProps {
  name: string
}

const Test: React.FC<TestProps> = ({name}) => {
  return (
    <div className={styles.Test}>Hello, {name}!</div>
  )
};

export default Test;

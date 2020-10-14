import React from 'react';

interface TestProps {
  name: string
}

const Test: React.FC<TestProps> = ({name}) => {
  return (
    <div>Hello, {name}!</div>
  )
};

export default Test;

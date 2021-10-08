import React from 'react';
import { geoblockType } from '../../../../types/geoBlockType';
import styles from './SideBar.module.css';

export const SideBar = () => {
  const blockNames = Object.keys(geoblockType);
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, blockName: string) => {
    event.dataTransfer.setData('application/reactflow', blockName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={styles.SideBar}
    >
      {blockNames.map((blockName: string) => (
        <div
          key={blockName}
          className={styles.Block}
          onDragStart={(event) => onDragStart(event, blockName)}
          draggable
        >
          {blockName}
        </div>
      ))}
    </div>
  );
};
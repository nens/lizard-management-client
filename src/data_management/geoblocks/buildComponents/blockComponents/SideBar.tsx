import React, { useState } from 'react';
import { geoblockType } from '../../../../types/geoBlockType';
import styles from './SideBar.module.css';

export const SideBar = () => {
  const blockNames = Object.keys(geoblockType);
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, blockName: string) => {
    event.dataTransfer.setData('application/reactflow', blockName);
    event.dataTransfer.effectAllowed = 'move';
  };

  const [searchInput, setSearchInput] = useState<string>('');

  return (
    <div
      className={styles.SideBar}
    >
      <input
        className={styles.SearchBar}
        type="text"
        placeholder={'Search ...'}
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />
      <div>
        {blockNames.filter(
          blockName => blockName.toLowerCase().includes(searchInput.toLowerCase())
        ).map(blockName => {
          // @ts-ignore
          const block = geoblockType[blockName];
          return (
            <div
              key={blockName}
              className={styles.Block}
              title={block.description}
              onDragStart={(event) => onDragStart(event, blockName)}
              draggable
            >
              {blockName}
            </div>
          );
        })}
      </div>
    </div>
  );
};
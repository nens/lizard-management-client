import React, { useState } from "react";
import { geoblockType } from "../../../../types/geoBlockType";
import { BlockDefinitionModal } from "./BlockDefinitionModal";
import styles from "./SideBar.module.css";

interface BlockDefinition {
  title: string;
  class: string;
  description: string;
  parameters: any;
}

export const SideBar = () => {
  const blockNames = Object.keys(geoblockType);
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, blockName: string) => {
    event.dataTransfer.setData("application/reactflow", blockName);
    event.dataTransfer.effectAllowed = "move";
  };

  // search bar input
  const [searchInput, setSearchInput] = useState<string>("");

  // Modal to show details of a block
  const [blockDefinition, setBlockDefinition] = useState<BlockDefinition | null>(null);

  return (
    <div className={styles.SideBar}>
      <input
        className={styles.SearchBar}
        type="text"
        placeholder={"Search ..."}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className={styles.BlocksContainer}>
        {blockNames
          .filter((blockName) => blockName.toLowerCase().includes(searchInput.toLowerCase()))
          .map((blockName) => {
            // @ts-ignore
            const block = geoblockType[blockName];
            return (
              <div
                key={blockName}
                className={styles.Block}
                title={block.description}
                onDragStart={(event) => onDragStart(event, blockName)}
                draggable
                onClick={() => setBlockDefinition({ ...block, title: blockName })}
              >
                {blockName}
              </div>
            );
          })}
      </div>
      {blockDefinition ? (
        <BlockDefinitionModal
          blockDefinition={blockDefinition}
          handleClose={() => setBlockDefinition(null)}
        />
      ) : null}
    </div>
  );
};

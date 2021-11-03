import React from 'react';
import ModalBackground from '../../../../components/ModalBackground';
import styles from './BlockDefinitionModal.module.css';

interface MyProps {
  blockDefinition: {
    title: string,
    class: string,
    description: string,
    parameters: {
      name: string,
      type: string | string[],
      [key: string]: any
    }[] | {
      type: string,
      items: {
        type: string
      }
    }
  },
  handleClose: () => void
}

export const BlockDefinitionModal = (props: MyProps) => {
  const { blockDefinition } = props;
  return (
    <ModalBackground
      title={blockDefinition.title}
      handleClose={props.handleClose}
      style={{
        width: '40%',
        height: '40%'
      }}
    >
      <div className={styles.MainContainer}>
        <div className={styles.BlockHeader}>
          <h4>{blockDefinition.class}</h4>
          <i>{blockDefinition.description} </i>
          <i>(<a href="https://dask-geomodeling.readthedocs.io/en/latest/raster.html">link to documentation</a>)</i>
        </div>
        <div className={styles.GridContainer}>
          <div>Input:</div>
          {Array.isArray(blockDefinition.parameters) ? (
            <div>
              {blockDefinition.parameters.map(parameter => (
                <div key={parameter.name}>
                  <b>{parameter.name}: </b>
                  {Array.isArray(parameter.type) ? (
                    <span>{parameter.type.join(', ')}</span>
                  ) : (
                    <span>{parameter.type}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div><b>List of RasterBlocks</b></div>
          )}
          <div>Output:</div>
          <div><b>RasterBlock</b></div>
        </div>
      </div>
    </ModalBackground>
  )
}
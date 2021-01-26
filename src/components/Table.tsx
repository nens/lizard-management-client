import React from 'react';
import styles from './Table.module.css';
import {DataRetrievalState} from '../types/retrievingDataTypes';
import MDSpinner from "react-md-spinner";


export interface ColumnDefinition {
  name?: string,
  titleRenderFunction: any;
  renderFunction: any; //(row: any): any; //returns field JSX.Element;
  orderingField: null | string;
}

interface Props {
  // name: string;
  tableData: any [];
  setTableData: any;
  gridTemplateColumns: string;
  columnDefinitions: ColumnDefinition[];
  dataRetrievalState: DataRetrievalState;
  triggerReloadWithCurrentPage: any;
  triggerReloadWithBasePage: any;
  getIfCheckBoxOfUuidIsSelected?: any;
}

const Table: React.FC<Props> = ({tableData, setTableData, gridTemplateColumns, columnDefinitions, dataRetrievalState, triggerReloadWithCurrentPage, triggerReloadWithBasePage, getIfCheckBoxOfUuidIsSelected}) => {
  return (
    <div  className={styles.Table}>
      <div style={{
        gridTemplateColumns: gridTemplateColumns,
      }}>
        {columnDefinitions.map(definition =>
          <span style={{justifyContent: definition.name === 'checkbox'? 'center' : 'flex-start'}}>
            {definition.titleRenderFunction()}
          </span>
        )}
      </div>
      <div style={{
          gridTemplateColumns: gridTemplateColumns,
        }}
      >
          {
            tableData.map(tableRow=>{
              const rowIsSelected = getIfCheckBoxOfUuidIsSelected && getIfCheckBoxOfUuidIsSelected(tableRow.uuid);
              const updateTableRow = (newTableRow: any) => {
                const newTableData = tableData.map((rowAllTables:any)=>{
                  if (rowAllTables.uuid ===  tableRow.uuid) {
                    return {...newTableRow}
                  } else{
                    return {...rowAllTables};
                  }
                })
                setTableData(newTableData);
              } 
              return (
                <>
                  {columnDefinitions.map(definition=>
                    <span className={rowIsSelected? styles.Selected: styles.NotSelected} style={{justifyContent: definition.name === 'checkbox'? 'center' : 'flex-start'}}>
                      {definition.renderFunction(tableRow, updateTableRow, triggerReloadWithCurrentPage, triggerReloadWithBasePage)}
                    </span>
                  )}
                </>
              );
            })
          }          
      </div>
      <div>
        <div className={styles.TableSpinner}>
          {dataRetrievalState === "NEVER_DID_RETRIEVE" || dataRetrievalState === "RETRIEVING"?
            // "LOADING"
            <MDSpinner size={96} />
          : dataRetrievalState === "RETRIEVED" && tableData.length === 0?
            "No data found for with current filter"
          : null
          }
        </div>
      </div>
    </div>
  )
};

export default Table;
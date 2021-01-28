import React from 'react';
import styles from './Table.module.css';
import {DataRetrievalState} from '../types/retrievingDataTypes';
import MDSpinner from "react-md-spinner";


export interface ColumnDefinition {
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
        {columnDefinitions.map((definition, i) => <span key={i}>{definition.titleRenderFunction()}</span>)}
      </div>
      <div style={{
          gridTemplateColumns: gridTemplateColumns,
        }}
      >
          {
            tableData.map((tableRow, idx) => {
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
                <React.Fragment key={idx}>
                  {columnDefinitions.map((definition, i)=>
                    <span className={rowIsSelected? styles.Selected: styles.NotSelected} key={idx + i}>
                      {definition.renderFunction(tableRow, updateTableRow, triggerReloadWithCurrentPage, triggerReloadWithBasePage)}
                    </span>
                  )}
                </React.Fragment>
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
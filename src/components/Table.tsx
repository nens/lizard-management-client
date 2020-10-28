import React from 'react';
import styles from './Table.module.css';
import {DataRetrievalState} from '../types/retrievingDataTypes'

export interface ColumnDefenition {
  titleRenderFunction: any;
  renderFunction: any; //(row: any): any; //returns field JSX.Element;
  orderingField: null | string;
}

interface Props {
  // name: string;
  tableData: any [];
  setTableData: any;
  gridTemplateColumns: string;
  columnDefenitions: ColumnDefenition[];
  dataRetrievalState: DataRetrievalState;
  triggerReloadWithCurrentPage: any;
  triggerReloadWithBasePage: any;
}

const Table: React.FC<Props> = ({tableData, setTableData, gridTemplateColumns, columnDefenitions, dataRetrievalState, triggerReloadWithCurrentPage, triggerReloadWithBasePage}) => {
  return (
      <div  className={styles.Table}>
        <div style={{
          gridTemplateColumns: gridTemplateColumns,
        }}>
          {columnDefenitions.map(defenition=><span>{defenition.titleRenderFunction()}</span>)}
        </div>
        <div style={{
            gridTemplateColumns: gridTemplateColumns,
          }}
        >
            {
              tableData.map(tableRow=>{
                return (
                  <>
                    {columnDefenitions.map(defenition=><span>{defenition.renderFunction(tableRow, tableData, setTableData, triggerReloadWithCurrentPage, triggerReloadWithBasePage)}</span>)}
                  </>
                );
              })
            }          
        </div>
        <div>
            <div>
              {
              dataRetrievalState === "NEVER_DID_RETRIEVE" || dataRetrievalState === "RETRIEVING"?
              "LOADING"
              : dataRetrievalState === "RETRIEVED" && tableData.length === 0?
              "No data found for with current filter"
              :
              null
              }
            </div>
          </div>
        
      </div>
  )
};

export default Table;
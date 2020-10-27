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
          // width: "1200px",
          // width: "100%",
          minWidth: "1200px",
            flexGrow: 1,
        }}>
          {/* <span><input type="checkbox"></input></span> */}
          {/* <span>Name</span>
          <span>Code</span>
          <span>temporal</span>
          <span>Size</span> */}
          {columnDefenitions.map(defenition=><span>{defenition.titleRenderFunction()}</span>)}
          {/* <span>Actions</span> */}
        </div>
        <div>
          {
          dataRetrievalState === "NEVER_DID_RETRIEVE" || dataRetrievalState === "RETRIEVING"?
          "LOADING"
          :
          null
          }
        </div>
        <div>
          {
          dataRetrievalState === "RETRIEVED" && tableData.length === 0?
          "No data found for with current filter"
          :
          null
          }
        </div>
        {/* <div> */}
          <div style={{
            gridTemplateColumns: gridTemplateColumns,
            // width: "100%",
            // width: "1200px",
            minWidth: "1200px",
            flexGrow: 1,
          }}>
            {
              tableData.map(tableRow=>{
                return (
                  <>
                    {/* <span><input type="checkbox"></input></span> */}
                    {/* <span>{tableRow.name}</span>
                    <span>{tableRow.supplier_code}</span>
                    <span>{tableRow.temporal === true? "Yes" : "No"}</span>
                    <span>2.5gb</span> */}
                    {columnDefenitions.map(defenition=><span>{defenition.renderFunction(tableRow, tableData, setTableData, triggerReloadWithCurrentPage, triggerReloadWithBasePage)}</span>)}
                    {/* <span>ACTIONS</span> */}
                  </>
                );
              })
            }
          </div>
        {/* </div> */}
        
      </div>
  )
};

export default Table;
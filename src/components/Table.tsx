import React from 'react';
import styles from './Table.module.css';

interface ColumnDefenition {
  titleRenderFunction: any;
  renderFunction: any; //(row: any): any; //returns field JSX.Element;
  sortable: boolean;
}

interface Props {
  // name: string;
  tableData: any [];
  gridTemplateColumns: string;
  columnDefenitions: ColumnDefenition[];
}

const Table: React.FC<Props> = ({tableData, gridTemplateColumns, columnDefenitions}) => {
  return (
      <div  className={styles.Table}>
        <div style={{gridTemplateColumns: gridTemplateColumns}}>
          {/* <span><input type="checkbox"></input></span> */}
          {/* <span>Name</span>
          <span>Code</span>
          <span>temporal</span>
          <span>Size</span> */}
          {columnDefenitions.map(defenition=><span>{defenition.titleRenderFunction()}</span>)}
          {/* <span>Actions</span> */}
        </div>
        <div style={{gridTemplateColumns: gridTemplateColumns}}>
        {
          tableData.map(tableRow=>{
            return (
              <>
                {/* <span><input type="checkbox"></input></span> */}
                {/* <span>{tableRow.name}</span>
                <span>{tableRow.supplier_code}</span>
                <span>{tableRow.temporal === true? "Yes" : "No"}</span>
                <span>2.5gb</span> */}
                {columnDefenitions.map(defenition=><span>{defenition.renderFunction(tableRow)}</span>)}
                {/* <span>ACTIONS</span> */}
              </>
            );
          })
        }
        </div>
      </div>
  )
};

export default Table;
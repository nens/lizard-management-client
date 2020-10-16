import React from 'react';
import styles from './Table.module.css';

interface ColumnDefenition {
  title: string;
  renderFunction: any; //(row: any): any; //returns field JSX.Element;
  sortable: boolean;
}

interface TestProps {
  // name: string;
  tableData: any [];
  gridTemplateColumns: string;
  columnDefenitions: ColumnDefenition[];
}

const Table: React.FC<TestProps> = ({tableData, gridTemplateColumns, columnDefenitions}) => {
  return (
      <div  className={styles.Table}>
        <div style={{gridTemplateColumns: gridTemplateColumns}}>
          <span><input type="checkbox"></input></span>
          <span>Name</span>
          <span>Code</span>
          <span>temporal</span>
          <span>Size</span>
          <span>Actions</span>
        </div>
        <div style={{gridTemplateColumns: gridTemplateColumns}}>
        {
          tableData.map(tableRow=>{
            return (
              <>
                <span><input type="checkbox"></input></span>
                <span>{tableRow.name}</span>
                <span>{tableRow.supplier_code}</span>
                <span>{tableRow.temporal === true? "Yes" : "No"}</span>
                <span>2.5gb</span>
                <span>ACTIONS</span>
              </>
            );
          })
        }
        </div>
      </div>
  )
};

export default Table;
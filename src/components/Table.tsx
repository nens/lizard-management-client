import React from 'react';
import styles from './Table.module.css';



interface TestProps {
  name: string;
  tableData: any [];
}

const Table: React.FC<TestProps> = ({name, tableData}) => {
  return (
    <div>
      <span>Hello, {name}!</span>
      <div  className={styles.Table}>
        <div>
          <span>Name</span>
          <span>Code</span>
          <span>temporal</span>
          <span>Size</span>
          <span>Actions</span>
        </div>
        <div>
        {
          tableData.map(tableRow=>{
            return (
              <>
                <span>{tableRow.name}</span>
                <span>{tableRow.supplier_code}</span>
                <span>{tableRow.temporal === true? "Yes" : "No"}</span>
                <span>{tableRow.size}</span>
                <span>2.5gb</span>
              </>
            );
          })
        }
        </div>
      </div>
    </div>

  )
};

export default Table;
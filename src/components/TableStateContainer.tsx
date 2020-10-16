import React from 'react';
import Table from './Table';
// import styles from './Table.module.css';

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

const TableStateContainer: React.FC<Props> = ({tableData, gridTemplateColumns, columnDefenitions}) => {
  return (
      <Table
        tableData={tableData} 
        gridTemplateColumns={gridTemplateColumns} 
        columnDefenitions={columnDefenitions}
      />
  )
};

export default TableStateContainer;
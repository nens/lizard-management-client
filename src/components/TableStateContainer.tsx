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
  baseUrl: string; // https://nxt3.staging.lizard.net/api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb
}

const TableStateContainer: React.FC<Props> = ({tableData, gridTemplateColumns, columnDefenitions, baseUrl}) => {
  return (
      <Table
        tableData={tableData} 
        gridTemplateColumns={gridTemplateColumns} 
        columnDefenitions={columnDefenitions}
      />
  )
};

export default TableStateContainer;
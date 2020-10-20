import React from 'react';
import Table from './../components/Table';
// import { listRastersForTable} from "../api/rasters";
import { rasterItems70Parsed } from './TableStoriesData';
import {styles} from '../App.module.css';


export default {
  component: Table,
  title: 'Table'
}



// export const world = () => <Table name="world" tableData={tableContent} />;

// export const people = () => <Table name="people" tableData={tableContent} />;

// listRastersForTable(
//   70, 1, "", true, organisation.uuid
// ).then(({results, count}) => {
//   const checkboxes = this.createCheckboxDataFromRaster(results);
//   this.setState({
//     rasters: results,
//     checkAllCheckBoxes: false,
//     checkboxes: checkboxes,
//     isFetching: false,
//     total: count,
//   });
// });

const rasterSourceColumnDefenitions = [
  {
    titleRenderFunction: () => <input type="checkbox"></input>,
    renderFunction: (row: any) => <input type="checkbox"></input>,
    orderingField: null ,
  },
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => row.name,
    orderingField: null ,
  },
  {
    titleRenderFunction: () =>  "Code",
    renderFunction: (row: any) => row.supplier_code,
    orderingField: null ,
  },
  {
    titleRenderFunction: () =>  "Temporal",
    renderFunction: (row: any) => row.temporal === true? "Yes" : "No",
    orderingField: null ,
  },
  {
    titleRenderFunction: () =>  "Size",
    renderFunction: (row: any) => "2.5gb",
    orderingField: null ,
  },
  {
    titleRenderFunction: () =>  "Actions",
    renderFunction: (row: any) => "Actions",
    orderingField: null ,
  },
];

export const raster = () =>  
  <Table 
    tableData={rasterItems70Parsed} 
    gridTemplateColumns={"10% 20% 20% 20% 20% 10%"} 
    columnDefenitions={rasterSourceColumnDefenitions} 
  />;


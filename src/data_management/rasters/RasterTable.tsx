import React from 'react';
import TableStateContainer from '../../components/TableStateContainer';
// import { listRastersForTable} from "../api/rasters";
import { rasterItems70Parsed } from '../../stories/TableStoriesData';
import {styles} from '../App.module.css';

const rasterSourceColumnDefenitions = [
  {
    titleRenderFunction: () => <input type="checkbox"></input>,
    renderFunction: (row: any) => <input type="checkbox"></input>,
    sortable: false,
  },
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => row.name,
    sortable: true,
  },
  {
    titleRenderFunction: () =>  "Code",
    renderFunction: (row: any) => row.supplier_code,
    sortable: true,
  },
  {
    titleRenderFunction: () =>  "Temporal",
    renderFunction: (row: any) => row.temporal === true? "Yes" : "No",
    sortable: false,
  },
  {
    titleRenderFunction: () =>  "Size",
    renderFunction: (row: any) => "2.5gb",
    sortable: true,
  },
  {
    titleRenderFunction: () =>  "Actions",
    renderFunction: (row: any) => "Actions",
    sortable: false,
  },
];

export const RasterTable = (props:any) =>  {
  return (
    <TableStateContainer 
      tableData={rasterItems70Parsed} 
      gridTemplateColumns={"10% 20% 20% 20% 20% 10%"} 
      columnDefenitions={rasterSourceColumnDefenitions}
      // /api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb
      baseUrl={"/api/v4/rasters/?writable=${writable}&page_size=${page_size}&page=${page}&name__icontains=${name__icontains}&ordering=${ordering}&organisation__uuid=${organisation__uuid}"} 
    />
  );
}
  


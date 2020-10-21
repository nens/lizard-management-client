import React from 'react';



import TableStateContainer from '../../components/TableStateContainer';
import { rasterItems70Parsed } from '../../stories/TableStoriesData';
import { NavLink } from "react-router-dom";


const baseUrl = "/api/v4/rasters/";

const rasterSourceColumnDefenitions = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row: any) => <NavLink to={`/data_management/rasters/${row.uuid}/`}>{row.name}</NavLink>,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Code",
    renderFunction: (row: any) => row.supplier_code,
    orderingField: "supplier_code",
  },
  {
    titleRenderFunction: () =>  "Temporal",
    renderFunction: (row: any) => row.temporal === true? "Yes" : "No",
    orderingField: null,
  },
  {
    titleRenderFunction: () =>  "Size",
    renderFunction: (row: any) => "2.5gb",
    orderingField: null,
  },
  {
    titleRenderFunction: () =>  "Actions",
    renderFunction: (row: any) => "Actions",
    orderingField: null,
  },
];

export const RasterTable = (props:any) =>  {

  const handleNewRasterClick  = () => {
    const { history } = props;
    history.push("/data_management/rasters/new");
  }

  return (
    <TableStateContainer 
      tableData={rasterItems70Parsed} 
      gridTemplateColumns={"10% 20% 20% 20% 20% 10%"} 
      columnDefenitions={rasterSourceColumnDefenitions}
      // /api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb
      // baseUrl={"/api/v4/rasters/?writable=${writable}&page_size=${page_size}&page=${page}&name__icontains=${name__icontains}&ordering=${ordering}&organisation__uuid=${organisation__uuid}"}
      baseUrl={`${baseUrl}?`} 
      showCheckboxes={true}
      newItemOnClick={handleNewRasterClick}
    />
  );
}
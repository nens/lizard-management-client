import React from 'react';
import Table from './../components/Table';
// import { listRastersForTable} from "../api/rasters";
import { rasterData70Items } from './TableStoriesData';
import {styles} from '../App.module.css';


export default {
  component: Table,
  title: 'Table'
}

const tableContentJson = '[{"id":68,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/f980a209-0ad2-4e87-afb8-0d6d2f5f5849/","name":"testAPIpost","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":null,"description":"test the POST of rasters","supplier":"lex.vandolderen","supplier_code":null,"aggregation_type":"curve","options":{"styles":"Blues:0.02:0.5"},"rescalable":true,"temporal":false,"interval":null,"access_modifier":"Private","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:49.412268Z","uuid":"f980a209-0ad2-4e87-afb8-0d6d2f5f5849","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"nelen-schuurmans:testapipost"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":81,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/73a1c2ed-0b39-4c1b-ab11-7a21615670fb/","name":"","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":null,"description":"","supplier":"carsten.byrman","supplier_code":null,"aggregation_type":"none","options":{},"rescalable":false,"temporal":false,"interval":null,"access_modifier":"Common","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:50.196211Z","uuid":"73a1c2ed-0b39-4c1b-ab11-7a21615670fb","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"users:"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":54,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/a4ef1df9-44d6-4b7b-90d2-5ed33c7383dd/","name":"Diff temporal rasters","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":{"url":"https://nxt3.staging.lizard.net/api/v4/observationtypes/450/","id":450,"code":"WATDPTE (m)","parameter":"Waterdiepte","unit":"m","scale":"interval","description":"","domain_values":null,"reference_frame":null,"compartment":null},"description":"Test met combinatie 3Di temporele rasters","supplier":null,"supplier_code":null,"aggregation_type":"none","options":{"styles":"Blues:0.025:0.5"},"rescalable":false,"temporal":true,"interval":null,"access_modifier":"Private","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:51.634666Z","uuid":"a4ef1df9-44d6-4b7b-90d2-5ed33c7383dd","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"intern:nl:demo:diff_temporal_depth4"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":26,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/26d0da48-3167-4d43-b4d8-9c907fc202ec/","name":"rws_noordzeekanaal","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":null,"description":"rws_noordzeekanaal","supplier":null,"supplier_code":null,"aggregation_type":"none","options":"{}","rescalable":false,"temporal":false,"interval":null,"access_modifier":"Public","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:52.433052Z","uuid":"26d0da48-3167-4d43-b4d8-9c907fc202ec","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"rws_noordzeekanaal"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":51,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/bc772d76-c31d-4014-9958-ef57bcaf0075/","name":"Test ftpimport","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":{"url":"https://nxt3.staging.lizard.net/api/v4/observationtypes/459/","id":459,"code":"WNS8875","parameter":"RELTVLVTHD[%][INSU][LT]","unit":"%","scale":"interval","description":"","domain_values":null,"reference_frame":null,"compartment":"LT"},"description":"test ftpimporter met Vietnam data","supplier":"test_ftpimporter","supplier_code":"NDVI_AnGiang_PestRisk","aggregation_type":"none","options":{"styles":"Blues:0:100"},"rescalable":false,"temporal":true,"interval":"7 00:00:00","access_modifier":"Private","first_value_timestamp":"2015-09-30T22:00:00Z","last_value_timestamp":"2015-10-28T22:00:00Z","source":{"name":"Optimizer","graph":{"Optimizer":["lizard_nxt.blocks.LizardRasterSource","cefefddd-d8b4-4820-a2b1-3199048f6f85"]}},"spatial_bounds":{"west":102.87102,"east":109.66216868481645,"north":12.59167,"south":8.275036125005501},"projection":"EPSG:4326","origin_x":102.87102,"origin_y":12.59167,"pixelsize_x":0.00177639254115,"pixelsize_y":-0.00177639254115,"last_modified":"2019-01-18T14:53:53.030515Z","uuid":"bc772d76-c31d-4014-9958-ef57bcaf0075","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"intern:import:vn:pestriskftp"},"writable":true,"datasets":[],"raster_sources":["https://nxt3.staging.lizard.net/api/v4/rastersources/cefefddd-d8b4-4820-a2b1-3199048f6f85/"],"is_geoblock":false},{"id":25,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/5cdda519-c0e5-47ab-bb6a-7c666df8d2d3/","name":"Overschrijding","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":null,"description":"Overschrijding","supplier":null,"supplier_code":null,"aggregation_type":"none","options":{},"rescalable":false,"temporal":false,"interval":null,"access_modifier":"Public","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:53.072893Z","uuid":"5cdda519-c0e5-47ab-bb6a-7c666df8d2d3","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"extern:bd:sat:potentialet"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":83,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/ab915085-b0d9-4898-ad43-e9be659fecd9/","name":"byrman2","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":null,"description":"foo","supplier":"carsten.byrman","supplier_code":null,"aggregation_type":"none","options":{},"rescalable":false,"temporal":false,"interval":null,"access_modifier":"Common","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:53.368513Z","uuid":"ab915085-b0d9-4898-ad43-e9be659fecd9","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"nelen-schuurmans:byrman2"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":27,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/edef2b11-7b1e-4806-bbd5-d440539efa14/","name":"NDVI (NL)","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"}],"observation_type":null,"description":"NDVI (NL)","supplier":null,"supplier_code":null,"aggregation_type":"none","options":{"width":1024,"height":1024,"styles":"YlGn:0:1000","zindex":20,"transparent":false},"rescalable":false,"temporal":true,"interval":null,"access_modifier":"Public","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:54.952988Z","uuid":"edef2b11-7b1e-4806-bbd5-d440539efa14","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"nl:flevoland"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":132,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/a8d87dfb-3b5d-45b1-91e2-182e3ef33cd9/","name":"trds","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":{"url":"https://nxt3.staging.lizard.net/api/v4/observationtypes/70/","id":70,"code":" 100-200 mHzgraden","parameter":" 100-200 mHz","unit":"graden","scale":"interval","description":"","domain_values":null,"reference_frame":null,"compartment":null},"description":"te","supplier":"aagje.hendriks","supplier_code":null,"aggregation_type":"counts","options":{"styles":"3di-damage"},"rescalable":false,"temporal":true,"interval":null,"access_modifier":"Private","first_value_timestamp":null,"last_value_timestamp":null,"source":null,"spatial_bounds":null,"projection":null,"origin_x":null,"origin_y":null,"pixelsize_x":null,"pixelsize_y":null,"last_modified":"2019-01-18T14:53:55.334512Z","uuid":"a8d87dfb-3b5d-45b1-91e2-182e3ef33cd9","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"trds"},"writable":true,"datasets":[],"raster_sources":[],"is_geoblock":false},{"id":140,"url":"https://nxt3.staging.lizard.net/api/v4/rasters/f3e3c9c2-e83e-4185-8057-3c26770b2137/","name":"Hoogte (AHN3)","organisation":{"url":"https://nxt3.staging.lizard.net/api/v4/organisations/61f5a464-c350-44c1-9bc7-d4b42d7f58cb/","uuid":"61f5a464-c350-44c1-9bc7-d4b42d7f58cb","name":"Nelen & Schuurmans"},"shared_with":[],"observation_type":{"url":"https://nxt3.staging.lizard.net/api/v4/observationtypes/99/","id":99,"code":"HOOGTEmNAP","parameter":"Hoogte","unit":"m","scale":"interval","description":"","domain_values":null,"reference_frame":"NAP","compartment":null},"description":"Hoogtemodel Nederland (AHN3)","supplier":null,"supplier_code":null,"aggregation_type":"curve","options":{"styles":"dem_nl"},"rescalable":true,"temporal":false,"interval":null,"access_modifier":"Private","first_value_timestamp":"1970-01-01T00:00:00Z","last_value_timestamp":"1970-01-01T00:00:00Z","source":{"name":"RasterStoreSource","graph":{"RasterStoreSource":["lizard_nxt.blocks.LizardRasterSource","c21eaae9-f6a1-4122-a266-28992fb49f34"]}},"spatial_bounds":{"west":4.946657789228477,"east":5.387204396123851,"north":52.37537213134247,"south":52.20603748295904},"projection":"EPSG:28992","origin_x":135000,"origin_y":481250,"pixelsize_x":0.5,"pixelsize_y":-0.5,"last_modified":"2019-01-18T14:53:57.015606Z","uuid":"f3e3c9c2-e83e-4185-8057-3c26770b2137","wms_info":{"endpoint":"https://nxt3.staging.lizard.net/wms/","layer":"ahn3"},"writable":true,"datasets":[],"raster_sources":["https://nxt3.staging.lizard.net/api/v4/rastersources/c21eaae9-f6a1-4122-a266-28992fb49f34/"],"is_geoblock":false}]';
const tableContent = JSON.parse(tableContentJson);
const rasterItems70Parsed = JSON.parse(rasterData70Items);

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
// tableRow.temporal === true? "Yes" : "No"
/*
<span>Code</span>
          <span>temporal</span>
          <span>Size</span>
          <span>Actions</span>
//*/

export const raster = () =>  
  <Table 
    tableData={rasterItems70Parsed} 
    gridTemplateColumns={"10% 20% 20% 20% 20% 10%"} 
    columnDefenitions={rasterSourceColumnDefenitions} 
  />;


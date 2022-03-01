import { RasterSourceFromAPI } from "../api/rasters";
import Table, { ColumnDefinition } from "./../components/Table";
import { rasterItems70Parsed } from "./TableStoriesData";

export default {
  component: Table,
  title: "Table",
};

const rasterSourceColumnDefinitions: ColumnDefinition<RasterSourceFromAPI>[] = [
  {
    titleRenderFunction: () => <input type="checkbox"></input>,
    renderFunction: (row) => <input type="checkbox"></input>,
    orderingField: null,
  },
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row) => row.name,
    orderingField: null,
  },
  {
    titleRenderFunction: () => "Code",
    renderFunction: (row) => row.supplier_code,
    orderingField: null,
  },
  {
    titleRenderFunction: () => "Temporal",
    renderFunction: (row) => (row.temporal === true ? "Yes" : "No"),
    orderingField: null,
  },
  {
    titleRenderFunction: () => "Size",
    renderFunction: (row) => "2.5gb",
    orderingField: null,
  },
  {
    titleRenderFunction: () => "Actions",
    renderFunction: (row) => "Actions",
    orderingField: null,
  },
];

export const raster = () => (
  <Table
    tableData={rasterItems70Parsed}
    gridTemplateColumns={"10% 20% 20% 20% 20% 10%"}
    columnDefinitions={rasterSourceColumnDefinitions}
    dataRetrievalState={"RETRIEVED"}
    setTableData={() => {}}
    triggerReloadWithCurrentPage={() => {}}
    triggerReloadWithBasePage={() => {}}
  />
);

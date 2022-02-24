import TableStateContainer from '../../components/TableStateContainer';
import { NavLink } from "react-router-dom";
import {ExplainSideColumn} from '../../components/ExplainSideColumn';
import tableStyles from "../../components/Table.module.css";
import labeltypesIcon from "../../images/labeltypes_icon.svg";
import { ColumnDefinition } from '../../components/Table';
import { LabelType } from '../../types/labelType';

const baseUrl = "/api/v3/labeltypes/";
const navigationUrl = "/management/data_management/labels/label_types";

const columnDefinitions: ColumnDefinition<LabelType>[] = [
  {
    titleRenderFunction: () => "Name",
    renderFunction: (row) => 
      <span
        className={tableStyles.CellEllipsis}
        title={row.name}
      >
        <NavLink to={`${navigationUrl}/${row.uuid}`}>{!row.name? "(empty name)" : row.name }</NavLink>
      </span>
    ,
    orderingField: "name",
  },
  {
    titleRenderFunction: () =>  "Uuid",
    renderFunction: (row) =>
      <span
        className={tableStyles.CellEllipsis}
        title={row.uuid}
      >
        {row.uuid}
      </span>
    ,
    orderingField: null,
  },
];

export const LabeltypesTable = () =>  {

  return (
    <ExplainSideColumn
      imgUrl={labeltypesIcon}
      imgAltDescription={"Label-types icon"}
      headerText={"Label types"}
      explanationText={"Label types are different types of labels that can exist in the system."}
      backUrl={"/management/data_management/labels"}
    >
      <TableStateContainer 
        gridTemplateColumns={"60% 40%"} 
        columnDefinitions={columnDefinitions}
        baseUrl={`${baseUrl}?`} 
        checkBoxActions={[]}
        filterOptions={[
          {value: 'name__icontains=', label: 'Name'},
          {value: 'uuid=', label: 'UUID'},
        ]}
      />
    </ExplainSideColumn>
  );
}
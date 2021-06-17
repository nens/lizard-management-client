import React, { useState } from 'react';
import { useTableData, Params } from '../api/hooks';
import Table from './Table';
import {ColumnDefinition} from './Table';
import Pagination from './Pagination';
import Checkbox from './Checkbox';
import TableSearchBox from './TableSearchBox';
import TableSearchToggle from './TableSearchToggle';
import { TableSearchToggleHelpText } from './TableSearchToggleHelpText';
import { Value } from '../form/SelectDropdown';
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from '../reducers';
import unorderedIcon from "../images/list_order_icon_unordered.svg";
import orderedIcon from "../images/list_order_icon_ordered.svg";
import styles from './Table.module.css';
import buttonStyles from '../styles/Buttons.module.css';

interface checkboxAction {
  displayValue: string,
  actionFunction: Function,
  checkIfActionIsApplicable?: (row: any) => boolean
}

interface Props {
  gridTemplateColumns: string;
  columnDefinitions: ColumnDefinition[];
  baseUrl: string;
  checkBoxActions: checkboxAction[];
  filterOptions?: Value[];
  newItemOnClick?: () => void | null;
  customTableButton?: {
    name: string,
    disabled?: boolean,
    onClick: () => void
  };
  queryCheckBox?: {text: string, extraParamsWhenChecked: Params};
  defaultUrlParams?: Params;
  responsive?: boolean;
}

// Helper function to get row identifier (by uuid or id)
// because sometimes tableData does not contain uuid but only id (e.g. alarm contacts)
const getRowIdentifier = (row: any): string => {
  return row.uuid || row.id + '';
};

const TableStateContainer: React.FC<Props> = ({
  gridTemplateColumns,
  columnDefinitions,
  baseUrl,
  checkBoxActions,
  filterOptions,
  newItemOnClick,
  customTableButton,
  queryCheckBox,
  defaultUrlParams,
  responsive,
}) => {
  const [checkBoxes, setCheckBoxes] = useState<string[]>([]);
  const [ordering, setOrdering] = useState<string | null>("last_modified");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedFilterOption, setSelectedFilterOption] = useState<Value | null>(filterOptions && filterOptions.length > 0 ? filterOptions[0] : null)
  const [queryCheckBoxState, setQueryCheckBoxState] = useState(false);

  let params: Params = {
    writable: "true",
    ...defaultUrlParams
  };

  if (ordering) {
    params.ordering = ordering;
  }

  if (selectedFilterOption && searchInput) {
    params['' + selectedFilterOption.value] = searchInput;
  }

  const selectedOrganisation = useSelector(getSelectedOrganisation);

  if (selectedOrganisation) {
    if (baseUrl.startsWith("/api/v4/timeseries/")) {
      params.location__organisation__uuid = selectedOrganisation.uuid;
    } else {
      params.organisation__uuid = selectedOrganisation.uuid;
    }
  }

  if (queryCheckBox && queryCheckBoxState) {
    params = {
      ...params,
      ...queryCheckBox.extraParamsWhenChecked
    };
  }

  const {
    status,
    tableData,
    error,
    pageSize,
    setPageSize,
    nextPage,
    previousPage,
    firstPage,
    reload,
    reloadToFirstPage
  } = useTableData(baseUrl, params);

  const addUuidToCheckBoxes = (uuid: string) => {
    const checkBoxesCopy = checkBoxes.map(uuid=>uuid);
    checkBoxesCopy.push(uuid);
    setCheckBoxes(checkBoxesCopy);
  }
  const removeUuidFromCheckBoxes = (uuidParameter: string) => {
    const checkBoxesCopy = checkBoxes.filter(uuid=> uuid !== uuidParameter);
    setCheckBoxes(checkBoxesCopy);
  }

  const removeAllChecked = () => {
    setCheckBoxes([])
  }

  const checkAllCheckBoxesOnCurrentPage = () => {
    const allCurrentPageUuids = tableData.map((row: any) => getRowIdentifier(row));
    const mergedArrays = [...new Set([...checkBoxes ,...allCurrentPageUuids])];
    setCheckBoxes(mergedArrays);
  }

  const isChecked = (uuidParameter:string) => {
    return !!checkBoxes.find((uuid) => uuid === uuidParameter)
  }

  const areAllOnCurrentPageChecked = () => {
    return tableData.length > 0 && tableData.every((row: any) => {
      return checkBoxes.find(uuid => uuid === getRowIdentifier(row))
    })
  }

  const dataWithCheckBoxes = tableData.map((tableRow:any) => {
    if (isChecked(getRowIdentifier(tableRow))) {
      return {...tableRow, checkboxChecked: true};
    } else {
      return {...tableRow, checkboxChecked: false};
    }
  })

  const checkBoxColumnDefinition: ColumnDefinition = {
    titleRenderFunction: () =>
      <Checkbox
        checked={areAllOnCurrentPageChecked()}
        onChange={()=>{
          if (areAllOnCurrentPageChecked()) {
            removeAllChecked();
          } else {
            checkAllCheckBoxesOnCurrentPage();
          }
        }}
      />,
    renderFunction: (row: any) =>
      <Checkbox
        checked={row.checkboxChecked}
        onChange={()=>{
          if (row.checkboxChecked) removeUuidFromCheckBoxes(getRowIdentifier(row))
          else addUuidToCheckBoxes(getRowIdentifier(row))
        }}
      />,
      orderingField: null,
  };

  const columnDefinitionsPlusCheckbox =
    checkBoxActions.length > 0 ?
      [checkBoxColumnDefinition].concat(columnDefinitions)
      :
      columnDefinitions
      ;

  const getIfCheckBoxOfUuidIsSelected = ((uuid: string) => {return checkBoxes.find(checkBoxUuid=> checkBoxUuid===uuid)});

  const columnDefinitionsPlusCheckboxSortable =
  columnDefinitionsPlusCheckbox.map((columnDefinition)=>{
    const originalTitleRenderFunction = columnDefinition.titleRenderFunction;
    const sortedTitleRenderFunction = () => {
      const originalContent = originalTitleRenderFunction();
      return (
        <span>
          {
            columnDefinition.orderingField?
            <>
              <button
                style={ordering !== columnDefinition.orderingField && ordering !== '-'+columnDefinition.orderingField ? {}: {display:"none"}}
                onClick={()=>{
                  setOrdering(columnDefinition.orderingField)
                }}
              >
                {originalContent}
                <img height="12px" src={`${unorderedIcon}`} alt="ordering icon unordened" />
              </button>
              <button
                style={ordering === columnDefinition.orderingField ?{}:{display:"none"}}
                onClick={()=>{
                  setOrdering("-" + columnDefinition.orderingField)
                }}
              >
                {originalContent}
                <img height="6px" src={`${orderedIcon}`} alt="ordering icon ordened" />
              </button>
              <button
                style={ordering === '-'+columnDefinition.orderingField ?{}:{display:"none"}}
                onClick={()=>{
                  setOrdering("last_modified");
                }}
              >
                {originalContent}
                <img height="6px" style={{transform: "scaleY(-1)",}} src={`${orderedIcon}`} alt="ordering icon ordened" />
              </button>
            </>
          :
          originalContent
          }
        </span>
      );
    }
    return {...columnDefinition, titleRenderFunction: sortedTitleRenderFunction}
  });

  return (
    <div style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
    }}>
      {/* above header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
          marginTop: "18px",
        }}
      >
        {filterOptions && filterOptions.length > 0 ?
                                                 <div
                                                   style={{
                                                     display: 'flex',
                                                     position: 'relative',
                                                   }}
                                                 >
                                                   <TableSearchBox
                                                     onChange={event=>{
                                                       const newValue = event.target.value;
                                                       setSearchInput(newValue);
                                                     }}
                                                     onClear={()=>setSearchInput("")}
                                                     value={searchInput}
                                                     placeholder={"Type to search"}
                                                   />
                                                   {filterOptions.length > 1 ? (
                                                     <TableSearchToggle
                                                       options={filterOptions}
                                                       value={selectedFilterOption}
                                                       valueChanged={option => setSelectedFilterOption(option)}
                                                     />
                                                   ) : null}
                                                   <TableSearchToggleHelpText
                                                     filterOption={selectedFilterOption}
                                                   />
                                                 </div>
                                               : <div />}
        <div>
          {queryCheckBox ?
           <span
             style={{
               display: "flex",
               alignItems: "center",
               fontWeight: 500,
               marginRight: 10,
             }}
           >
             <span style={{marginRight: "8px"}}>{queryCheckBox.text}</span>
             <Checkbox
               checked={queryCheckBoxState}
               onChange={()=>{
                 if (queryCheckBoxState) setQueryCheckBoxState(false);
                 else setQueryCheckBoxState(true)
               }}
               size={32}
             />
           </span>
          : null}
          {customTableButton ? (
            <button
              className={buttonStyles.NewButton}
              onClick={customTableButton.onClick}
              disabled={customTableButton.disabled}
              style={{ marginRight: 10 }}
            >
              {customTableButton.name}
            </button>
          ) : null}
          {newItemOnClick ?
           <button
             onClick={newItemOnClick}
             className={buttonStyles.NewButton}
           >
             + New Item
           </button>
          : null}
        </div>
      </div>
      <div
        // @ts-ignore
        style={{
          visibility: checkBoxes.length > 0? "visible" : "hidden",
          display: checkBoxActions.length === 0? "none" :"flex",
          justifyContent: "space-between",
          backgroundColor: "var(--color-header)",
          color: "var(--color-light-main-second)",
          // @ts-ignore
          fontWeight: "var(--font-weight-button)",
        }}
      >
        <div
          style={{
            paddingTop: "17px",
            paddingBottom: "17px",
            paddingLeft: "12px",
          }}
        >
          {`${checkBoxes.length} items selected`}
        </div>
        <div>
          {
            checkBoxActions.map((checkboxAction, i) => {
              const { displayValue, actionFunction, checkIfActionIsApplicable } = checkboxAction;
              const selectedRows = checkIfActionIsApplicable ? (
                tableData.filter((row: any) => getIfCheckBoxOfUuidIsSelected(getRowIdentifier(row)) && checkIfActionIsApplicable(row))
              ) : (
                tableData.filter((row: any) => getIfCheckBoxOfUuidIsSelected(getRowIdentifier(row)))
              );
              return (
                <button
                  key={i}
                  // XXX setTableData
                  onClick={() => actionFunction(selectedRows, tableData, () => {} , reload, reload, setCheckBoxes)}
                  className={styles.TableActionButton}
                >
                  {`${displayValue} (${selectedRows.length})`}
                </button>
              );
            })
          }
        </div>
      </div>
      <div style={{flex:1, minHeight: 0}}>
        <Table
          tableData={dataWithCheckBoxes}
          setTableData={() => {}} // XXX
          gridTemplateColumns={gridTemplateColumns}
          columnDefinitions={columnDefinitionsPlusCheckboxSortable}
          dataRetrievalState={
          status === 'success' ? 'RETRIEVED' : status === 'loading' ? 'RETRIEVING' : {status: "ERROR", errorMesssage: `${error}`, url: baseUrl}
          }
          triggerReloadWithCurrentPage={reload}
          triggerReloadWithBasePage={reloadToFirstPage}
          getIfCheckBoxOfUuidIsSelected={getIfCheckBoxOfUuidIsSelected}
          responsive={responsive}
        />
      </div>
      <Pagination
        toPage1={firstPage}
        toNext={nextPage}
        toPrevious={previousPage}
        itemsPerPage={pageSize}
        setItemsPerPage={setPageSize}
      />
    </div>
  )
};

export default TableStateContainer;

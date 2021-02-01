import React from 'react';
import {useState, useEffect,}  from 'react';
import Table from './Table';
import {ColumnDefinition} from './Table';
import Pagination from './Pagination';
import Checkbox from './Checkbox';
import TableSearchBox from './TableSearchBox';
import { useSelector } from "react-redux";
import { getSelectedOrganisation } from '../reducers';
import {DataRetrievalState} from '../types/retrievingDataTypes';
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
  textSearchBox?: boolean; // default true
  newItemOnClick?: () => void | null;
  queryCheckBox?: {text: string, adaptUrlFunction: (url:string)=>string} | null;
  defaultUrlParams?: string;
}

const TableStateContainer: React.FC<Props> = ({ gridTemplateColumns, columnDefinitions, baseUrl, checkBoxActions, textSearchBox, newItemOnClick, queryCheckBox/*action*/, defaultUrlParams }) => {

  const [tableData, setTableData] = useState<any[]>([]);
  const [checkBoxes, setCheckBoxes] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");
  const [previousUrl, setPreviousUrl] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [ordering, setOrdering] = useState<string | null>("last_modified");
  const [nameContains, setNameContains] = useState("");
  const [dataRetrievalState, setDataRetrievalState] = useState<DataRetrievalState>("NEVER_DID_RETRIEVE");
  const [apiResponse, setApiResponse] = useState<{response:any, currentUrl: string, dataRetrievalState: DataRetrievalState}>({response: {}, currentUrl: "", dataRetrievalState: "NEVER_DID_RETRIEVE"});
  const [queryCheckBoxState, setQueryCheckBoxState] = useState(false);

  // todo later: find out how the state of the table can be represented in the url?

  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const selectedOrganisationUuid = selectedOrganisation ? selectedOrganisation.uuid : "";

  const preUrl = baseUrl +
    "writable=true" +
    "&page_size=" + itemsPerPage +
    "&page=1" +
    (nameContains !==""? "&name__icontains=" + nameContains: "") +
    "&ordering=" + ordering +
    "&organisation__uuid=" + selectedOrganisationUuid +
    (defaultUrlParams ? defaultUrlParams : '');

  const url = queryCheckBox && queryCheckBoxState? queryCheckBox.adaptUrlFunction(preUrl) : preUrl
    
  useEffect(() => { 
    if (currentUrl !== "" && currentUrl === apiResponse.currentUrl) {
      apiResponse.response.results && setTableData(apiResponse.response.results);
      // make sure no checkboxes are checked outside of current page !
      apiResponse.response.results && setCheckBoxes(checkBoxesPar=>checkBoxesPar.filter(value => (apiResponse.response.results.map((item:any)=>item.uuid)).includes(value)));
      setDataRetrievalState(apiResponse.dataRetrievalState)
      // we need to split on "lizard.net" because both nxt3.staging.lizard.net/api/v4 and demo.lizard.net/api/v4 both should parse out "/api/v4"
      if (apiResponse.response.next) setNextUrl(apiResponse.response.next.split("lizard.net")[1]);
      else if (apiResponse.response.next === null)  setNextUrl("")
      if (apiResponse.response.previous) setPreviousUrl(apiResponse.response.previous.split("lizard.net")[1]);
      else if (apiResponse.response.previous === null) setPreviousUrl("")
    }
  }, [apiResponse, currentUrl]);

  useEffect(() => { 
    fetchWithUrl(url);
  }, [url]);

  const fetchWithUrl = (url: string) => {
    setDataRetrievalState("RETRIEVING");
    setCurrentUrl(url);
    return fetch(url, {
      credentials: "same-origin"
    }).then(response=>{
      return response.json();
    }).then(parsedResponse=>{
      setApiResponse({response: parsedResponse, currentUrl: url, dataRetrievalState: "RETRIEVED"})
    }).catch(error=>{
      console.log('fetching table data for url failed with error', url, error);
      setApiResponse({response: {}, currentUrl: url, dataRetrievalState: {status:"ERROR", errorMesssage: error, url: url}})
    });
  }

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
    const allCurrentPageUuids = tableData.map(row=>row.uuid as string);
    const mergedArrays = [...new Set([...checkBoxes ,...allCurrentPageUuids])];
    setCheckBoxes(mergedArrays);
  }

  const isChecked = (uuidParameter:string) => {
    return !!checkBoxes.find((uuid) => uuid === uuidParameter)
  }

  const areAllOnCurrentPageChecked = () => {
    return tableData.length > 0 && tableData.every(row=>{
      return checkBoxes.find(uuid=>uuid===row.uuid)
    })
  }

  const dataWithCheckBoxes = tableData.map((tableRow:any) => {
    if (isChecked(tableRow.uuid)) {
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
          if (row.checkboxChecked) removeUuidFromCheckBoxes(row.uuid)
          else addUuidToCheckBoxes(row.uuid)
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
  columnDefinitionsPlusCheckbox.map((columnDefinition, ind)=>{
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
        { textSearchBox?
        <TableSearchBox
          onChange={event=>{
            const newValue = event.target.value;
            setNameContains(newValue);
          }}
          onClear={()=>setNameContains("")}
          value={nameContains}
          placeholder={"Type to search for name"}
        />
        :null}

        {
          newItemOnClick? 
          <button
            onClick={newItemOnClick}
            className={buttonStyles.NewButton}
          >
            + New Item
          </button>
          :
          null
        }
        {
          queryCheckBox?
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500
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
          :
          null
        }
      </div>
      
      <div
        // @ts-ignore
        style={{
          visibility: checkBoxes.length > 0? "visible" : "hidden",
          display: checkBoxActions.length === 0? "none" :"flex",
          justifyContent: "space-between",
          backgroundColor: "var(--color-header)",
          color: "var(--color-ligth-main-second)",
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
              tableData.filter(row => getIfCheckBoxOfUuidIsSelected(row.uuid) && checkIfActionIsApplicable(row))
            ) : (
              tableData.filter(row => getIfCheckBoxOfUuidIsSelected(row.uuid))
            );
            return (
              <button
                key={i}
                onClick={() => actionFunction(selectedRows, tableData, setTableData, ()=>fetchWithUrl(currentUrl), ()=>fetchWithUrl(url), setCheckBoxes)}
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
          setTableData={setTableData}
          gridTemplateColumns={gridTemplateColumns} 
          columnDefinitions={columnDefinitionsPlusCheckboxSortable}
          dataRetrievalState={dataRetrievalState}
          triggerReloadWithCurrentPage={()=>{fetchWithUrl(currentUrl)}}
          triggerReloadWithBasePage={()=>{fetchWithUrl(url)}}
          getIfCheckBoxOfUuidIsSelected={getIfCheckBoxOfUuidIsSelected}
        />
      </div>
      
      
      <Pagination
        page1Url={url}
        previousUrl={previousUrl}
        nextUrl={nextUrl}
        itemsPerPage={itemsPerPage}
        reloadFromUrl={fetchWithUrl}
        setItemsPerPage={setItemsPerPage}
      />

    </div>
  )
};

export default TableStateContainer;
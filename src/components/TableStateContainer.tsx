import React from 'react';
import {useState, useEffect,}  from 'react';
import Table from './Table';
import {ColumnDefenition} from './Table';
import Pagination from './Pagination';
import Checkbox from './Checkbox';
import TableSearchBox from './TableSearchBox';
import { connect, useSelector } from "react-redux";
import { getSelectedOrganisation } from '../reducers'
import { withRouter } from "react-router-dom";
import {  injectIntl } from "react-intl";
import {DataRetrievalState} from '../types/retrievingDataTypes';
import unorderedIcon from "../images/list_order_icon_unordered.svg";
import orderedIcon from "../images/list_order_icon_ordered.svg";
import styles from './Table.module.css';

interface Props {
  gridTemplateColumns: string;
  columnDefenitions: ColumnDefenition[];
  baseUrl: string; 
  checkBoxActions: any[];
  newItemOnClick: () => void | null;
  queryCheckBox: {text: string, adaptUrlFunction: (url:string)=>string} | null;
}

const TableStateContainerElement: React.FC<Props> = ({ gridTemplateColumns, columnDefenitions, baseUrl, checkBoxActions, newItemOnClick, queryCheckBox/*action*/}) => {

  const [tableData, setTableData] = useState([]);
  const [checkBoxes, setCheckBoxes] = useState([]);
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
    "&organisation__uuid=" + selectedOrganisationUuid;

  const url = queryCheckBox && queryCheckBoxState? queryCheckBox.adaptUrlFunction(preUrl) : preUrl
    
  useEffect(() => { 
    if (currentUrl !== "" && currentUrl === apiResponse.currentUrl) {
      apiResponse.response.results && setTableData(apiResponse.response.results);
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
    // @ts-ignore
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
    // @ts-ignore
    const allCurrentPageUuids = tableData.map(row=>row.uuid);
    // @ts-ignore
    const mergedArrays = [...new Set([...checkBoxes ,...allCurrentPageUuids])];
    // @ts-ignore
    setCheckBoxes(mergedArrays);
  }

  const isChecked = (uuidParameter:string) => {
    return !!checkBoxes.find((uuid) => uuid === uuidParameter)
  }

  const areAllOnCurrentPageChecked = () => {
    return tableData.length > 0 && tableData.every(row=>{
      // @ts-ignore
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

  const checkBoxColumnDefenition: ColumnDefenition = {
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

  const columnDefenitionsPlusCheckbox = 
    checkBoxActions.length > 0 ?  
      [checkBoxColumnDefenition].concat(columnDefenitions)
      :
      columnDefenitions
      ;

  const getIfCheckBoxOfUuidIsSelected = ((uuid: string) => {return checkBoxes.find(checkBoxUuid=> checkBoxUuid===uuid)});

  const columnDefenitionsPlusCheckboxSortable =
  columnDefenitionsPlusCheckbox.map((columnDefenition, ind)=>{
    const originalTitleRenderFunction = columnDefenition.titleRenderFunction;
    const sortedTitleRenderFunction = () => {
      const originalContent = originalTitleRenderFunction();
      return (
        <span>
          {originalContent}
          {
            columnDefenition.orderingField?
            // <button
            //   onClick={()=>{
            //     if (ordering === columnDefenition.orderingField) {
            //       setOrdering("-" + columnDefenition.orderingField)
            //     } else if (ordering === ("-" + columnDefenition.orderingField)) {
            //       setOrdering(columnDefenition.orderingField)
            //     } else {
            //       // ordering !== columnDefenition.orderingField
            //       setOrdering(columnDefenition.orderingField)
            //     }
            //   }}
            // >
            //   {
            //     ordering === columnDefenition.orderingField ? "v":
            //     ordering === ("-" + columnDefenition.orderingField) ? "^":
            //     ">"
            //   }
            // </button>
            <>
              <button
                style={ordering !== columnDefenition.orderingField && ordering !== '-'+columnDefenition.orderingField ? {}: {display:"none"}}
                onClick={()=>{
                  setOrdering(columnDefenition.orderingField)
                }}
              >
                <img height="12px" src={`${unorderedIcon}`} alt="ordering icon unordened" />
              </button>
              <button
                style={ordering === columnDefenition.orderingField ?{}:{display:"none"}}
                onClick={()=>{
                  setOrdering("-" + columnDefenition.orderingField)
                }}
              >
                <img height="6px" src={`${orderedIcon}`} alt="ordering icon ordened" />
              </button>
              <button
                style={ordering === '-'+columnDefenition.orderingField ?{}:{display:"none"}}
                onClick={()=>{
                  setOrdering("last_modified");
                }}
              >
                <img height="6px" style={{transform: "scaleY(-1)",}} src={`${orderedIcon}`} alt="ordering icon ordened" />
              </button>
            </>
          :
          null
          }
        </span>
      );
    }
    return {...columnDefenition, titleRenderFunction: sortedTitleRenderFunction}
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
          marginTop: "16px",
        }}
      >
        <TableSearchBox
          onChange={event=>{
            const newValue = event.target.value;
            setNameContains(newValue);
          }}
          onClear={()=>setNameContains("")}
          value={nameContains}
          placeholder={"Type to search"}
        />

        {
          newItemOnClick? 
          <button
            onClick={newItemOnClick}
            style={{
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingLeft: "32px",
              paddingRight: "40px",
              color: "white",
              backgroundColor: "#009F86",
              textTransform: "uppercase",
              border: "none",
              boxShadow: "2px 2px 2px #00000029",
              borderRadius: "3px",
            }}
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
            }}
          >
            <span style={{marginRight: "8px"}}>{queryCheckBox.text}</span>
             <Checkbox 
                checked={queryCheckBoxState} 
                onChange={()=>{
                  if (queryCheckBoxState) setQueryCheckBoxState(false);
                  else setQueryCheckBoxState(true)
                }} 
              />
          </span>
          :
          null
        }
      </div>
      
      <div
        style={{
          visibility: checkBoxes.length > 0? "visible" : "hidden",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "var(--color-header)",
          color: "var(--color-ligth-main-second)",
          fontWeight: 600,
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
          checkBoxActions.map(checkboxAction=>{
            return (
              <button
                onClick={()=>{
                  // @ts-ignore
                  const rows = tableData.filter((row) => {return getIfCheckBoxOfUuidIsSelected(row.uuid)})
                  checkboxAction.actionFunction(rows, tableData, setTableData, ()=>fetchWithUrl(currentUrl), ()=>fetchWithUrl(url), setCheckBoxes)
                }}
                className={styles.TableActionButton}
              >
                {`${checkboxAction.displayValue} (${checkBoxes.length})`}
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
          columnDefenitions={columnDefenitionsPlusCheckboxSortable}
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

const mapStateToProps = (state:any, ownProps:any) => {
  return {
    bootstrap: state.bootstrap,
    organisations: state.organisations
  };
};

const mapDispatchToProps = (dispatch:any, ownProps:any) => {
  return {
  }
};

const TableStateContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(TableStateContainerElement)));

export default TableStateContainer
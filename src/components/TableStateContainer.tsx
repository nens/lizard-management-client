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

interface Props {
  tableData: any [];
  gridTemplateColumns: string;
  columnDefenitions: ColumnDefenition[];
  baseUrl: string; 
  // https://nxt3.staging.lizard.net/api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb
  // /api/v4/rasters/?writable=${writable}&page_size=${page_size}&page=${page}&name__icontains=${name__icontains}&ordering=${ordering}&organisation__uuid=${organisation__uuid}
  showCheckboxes: boolean;
  newItemOnClick: any | null
}

const TableStateContainerElement: React.FC<Props> = ({ gridTemplateColumns, columnDefenitions, baseUrl, showCheckboxes, newItemOnClick}) => {

  const [tableData, setTableData] = useState([]);
  const [checkBoxes, setCheckBoxes] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [previousUrl, setPreviousUrl] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("20");
  // key will be based on ordr in array, but be aware that checkbox is added to beginning
  const [ordering, setOrdering] = useState<string | null>("last_modified");
  // const sortableList: SortingState[]  = columnDefenitions.map(item=> item.sortable? "NOT_SORTED" : "NOT_SORTABLE");
  // const [sortingStatePerColumnIndex, setSortingStatePerColumnIndex] = useState(showCheckboxes? ["NOT_SORTABLE"].concat(sortableList): sortableList);
  const [nameContains, setNameContains] = useState("");
  const [dataRetrievalState, setDataRetrievalState] = useState<DataRetrievalState>("NEVER_DID_RETRIEVE");

  // todo pass sorting name as column defenition v
  // find out sorting in heigh to low versus low to heigh translates in parameter v
  // do actions column logic
  // remove any
  //

  // const sorting = sortingStatePerColumnIndex.
  // todo later: find out how the state of the table can be represented in the url?


  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const selectedOrganisationUuid = selectedOrganisation ? selectedOrganisation.uuid : "";

  // const url = "/api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb";
  const url = baseUrl +
    "writable=true" +
    "&page_size=" + itemsPerPage +
    "&page=1" +
    (nameContains !==""? "&name__icontains=" + nameContains: "") +
    "&ordering=" + ordering +
    "&organisation__uuid=" + selectedOrganisationUuid;

  useEffect(() => { 
    fetchWithUrl(url);
  }, [url]);

  const fetchWithUrl = (url: string) => {
    setDataRetrievalState("RETRIEVING")
    fetch(url, {
      credentials: "same-origin"
    }).then(response=>{
      return response.json();
    }).then(parsedResponse=>{
      setTableData(parsedResponse.results);
      setDataRetrievalState("RETRIEVED")
      // we need to split on "lizard.net" because both nxt3.staging.lizard.net/api/v4 and demo.lizard.net/api/v4 both should parse out "/api/v4"
      if (parsedResponse.next) setNextUrl(parsedResponse.next.split("lizard.net")[1]);
      else setNextUrl("")
      if (parsedResponse.previous) setPreviousUrl(parsedResponse.previous.split("lizard.net")[1]);
      else setPreviousUrl("")
    }).catch(error=>{
      console.log('fetching table data for url failed with error', url, error);
      setDataRetrievalState({status:"ERROR", errorMesssage: error, url: url})
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
    showCheckboxes ?  
      [checkBoxColumnDefenition].concat(columnDefenitions)
      :
      columnDefenitions
      ;

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
            <button
              onClick={()=>{
                if (ordering === columnDefenition.orderingField) {
                  setOrdering("-" + columnDefenition.orderingField)
                } else if (ordering === ("-" + columnDefenition.orderingField)) {
                  setOrdering(columnDefenition.orderingField)
                } else {
                  // ordering !== columnDefenition.orderingField
                  setOrdering(columnDefenition.orderingField)
                }
              }}
            >
              {
                ordering === columnDefenition.orderingField ? "v":
                ordering === ("-" + columnDefenition.orderingField) ? "^":
                ">"
              }
            </button>
          :
          null
          }
        </span>
      );
    }
    return {...columnDefenition, titleRenderFunction: sortedTitleRenderFunction}
  });

  return (
    <>
      {/* above header */}
      <div>
        <TableSearchBox
          onChange={event=>{
            const newValue = event.target.value;
            setNameContains(newValue);
          }}
          value={nameContains}
          placeholder={"Search for raster sources or layers"}
        />

        {
          newItemOnClick? 
          <button
            onClick={newItemOnClick}
          >
            + New Item
          </button>
          :
          null
        }
      </div>
      
      <Table
        // tableData={tableData} 
        // gridTemplateColumns={gridTemplateColumns} 
        // columnDefenitions={columnDefenitions}
        tableData={dataWithCheckBoxes} 
        gridTemplateColumns={gridTemplateColumns} 
        columnDefenitions={columnDefenitionsPlusCheckboxSortable}
        dataRetrievalState={dataRetrievalState}
      />
      
      <Pagination
        page1Url={url}
        previousUrl={previousUrl}
        nextUrl={nextUrl}
        itemsPerPage={itemsPerPage}
        reloadFromUrl={fetchWithUrl}
        setItemsPerPage={setItemsPerPage}
      />

    </>
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
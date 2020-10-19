import React from 'react';
import {useState, useEffect,}  from 'react';
import Table from './Table';
import Pagination from './Pagination';
// import styles from './Table.module.css';
import { connect, useSelector } from "react-redux";
import { getSelectedOrganisation } from '../reducers'
import { withRouter } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";


interface ColumnDefenition {
  titleRenderFunction: any;
  renderFunction: any; //(row: any): any; //returns field JSX.Element;
  sortable: boolean;
}

interface Props {
  // name: string;
  tableData: any [];
  gridTemplateColumns: string;
  columnDefenitions: ColumnDefenition[];
  baseUrl: string; 
  // https://nxt3.staging.lizard.net/api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb
  // /api/v4/rasters/?writable=${writable}&page_size=${page_size}&page=${page}&name__icontains=${name__icontains}&ordering=${ordering}&organisation__uuid=${organisation__uuid}
}

const TableStateContainerElement: React.FC<Props> = ({ gridTemplateColumns, columnDefenitions, baseUrl}) => {

  const [tableData, setTableData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [previousUrl, setPreviousUrl] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState("20");


  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const selectedOrganisationUuid = selectedOrganisation ? selectedOrganisation.uuid : "";

  // const url = "/api/v4/rasters/?writable=true&page_size=10&page=1&name__icontains=&ordering=last_modified&organisation__uuid=61f5a464c35044c19bc7d4b42d7f58cb";
  const url = baseUrl
    .replace("${organisation__uuid}", selectedOrganisationUuid)
    .replace("${writable}", "true")
    .replace("${page_size}", itemsPerPage+'')
    .replace("${page}", "1")
    .replace("${ordering}", "last_modified")
    // this icontains contains userinput keep it at the last because otherwise user can input ${} and break things
    .replace("${name__icontains}", "");

  useEffect(() => { 
    fetchWithUrl(url);
  }, [selectedOrganisationUuid, itemsPerPage]);

  const fetchWithUrl = (url: string) => {
    fetch(url, {
      credentials: "same-origin"
    }).then(response=>{
      return response.json();
    }).then(parsedResponse=>{
      setTableData(parsedResponse.results);
      // we need to split on "lizard.net" because both nxt3.staging.lizard.net/api/v4 and demo.lizard.net/api/v4 both should parse out "/api/v4"
      if (parsedResponse.next) setNextUrl(parsedResponse.next.split("lizard.net")[1]);
      else setNextUrl("")
      if (parsedResponse.previous) setPreviousUrl(parsedResponse.previous.split("lizard.net")[1]);
      else setPreviousUrl("")
    }).catch(error=>{
      console.log('fetching table data for url failed with error', url, error);
    });
  }

  return (
    <>
      <Table
        tableData={tableData} 
        gridTemplateColumns={gridTemplateColumns} 
        columnDefenitions={columnDefenitions}
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
import alarmIcon from "../../images/alarm@3x.svg";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import rasterTableStyles from "../../styles/RasterTable.css";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import PaginationBar from "./PaginationBar";
import { Row } from "./Row";
import React, { Component } from "react";
import styles from "./App.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import uploadIcon from "../../images/outline-cloud_upload-24px.svg";

class Raster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      rasters: [],
      filteredSortedRasters: [],
      paginatedRasters: [],
      total: 0,
      page: 1,
      pageSize: 10,
      checkAllCheckBoxes: false,
      // Add checkbox array with id, raster and whether of not the checkbox
      // is checked, to be able to find the raster back from the checked checkboxes.
      checkboxes: [],
      searchTerms: ""
    };
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.handleDeleteRasterClick = this.handleDeleteRasterClick.bind(this);
    this.checkAllCheckBoxes = this.checkAllCheckBoxes.bind(this);
    this.clickRegularCheckbox = this.clickRegularCheckbox.bind(this);
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.getRastersFromApi(page, this.state.searchTerms);
  }
  componentWillReceiveProps(props) {
    let page = 1;
    if (
      this.props.organisations.selected.uuid ===
      props.organisations.selected.uuid
    ) {
      page = this.state.page;
    }

    this.refreshRasterFilteringAndPaginationAndUpdateState(
      this.state.rasters,
      page,
      this.state.searchTerms,
      props.organisations.selected
    );
  }

  filterSortRasters = (rasters, searchContains, organisation) => {
    const filteredRasters = rasters.filter(
      e =>
        (e.name.toLowerCase().includes(searchContains.toLowerCase()) ||
          e.description.toLowerCase().includes(searchContains.toLowerCase())) &&
        e.organisation.unique_id.replace(/-/g, "") === organisation.uuid
    );
    const sortedFilteredRasters = filteredRasters.sort(
      (a, b) => a.last_modified > b.last_modified
    );
    return sortedFilteredRasters;
  };

  paginateRasters = (rasters, page) => {
    const paginatedRasters = rasters.slice(
      this.state.pageSize * (page - 1),
      this.state.pageSize * page
    );
    return paginatedRasters;
  };

  refreshRasterFilteringAndPaginationAndUpdateState = (
    rasters,
    page,
    searchTerms,
    organisation
  ) => {
    const filteredSortedRasters = this.filterSortRasters(
      rasters,
      searchTerms,
      organisation
    );
    const paginatedRasters = this.paginateRasters(filteredSortedRasters, page);
    const checkboxes = this.createCheckboxDataFromRaster(paginatedRasters);

    this.setState({
      isFetching: false,
      total: filteredSortedRasters.length,
      rasters: rasters,
      filteredSortedRasters: filteredSortedRasters,
      paginatedRasters: paginatedRasters,
      page: page,
      checkAllCheckBoxes: false,
      checkboxes: checkboxes,
      searchTerms: searchTerms
    });
  };
  getRastersFromApi = (page, searchContains) => {
    // const url = searchContains
    //   ? // ordering is done by filter
    //     `/api/v3/rasters/?writable=true&page=${page}&name__icontains=${searchContains}` // &organisation__unique_id=${organisationId},
    //   : // ordering is done so latest rasters first
    //     `/api/v3/rasters/?writable=true&ordering=-last_modified&page=${page}`;
    const url = "/api/v3/rasters/?writable=true&page_size=100000";

    fetch(url, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => {
        const rasters = data.results;
        this.refreshRasterFilteringAndPaginationAndUpdateState(
          rasters,
          page,
          searchContains,
          this.props.organisations.selected
        );
      });
  };

  createCheckboxDataFromRaster(rasterList) {
    let checkboxes = [];
    for (var i = 0; i < rasterList.length; i++) {
      var newDict = {
        id: i,
        raster: rasterList[i],
        checked: false
      };
      checkboxes.push(newDict);
    }
    return checkboxes;
  }

  handleNewRasterClick() {
    const { history } = this.props;
    history.push("/data_management/rasters/new");
  }

  handleDeleteRasterClick() {
    var toBeDeletedRasterNamesArray = [];
    var toBeDeletedRasterUuidsArray = [];

    this.state.checkboxes.forEach(function(checkbox) {
      // Make sure that the checkbox is checked
      if (checkbox.checked) {
        toBeDeletedRasterNamesArray.push(checkbox.raster.name);
        toBeDeletedRasterUuidsArray.push(checkbox.raster.uuid);
      }
    });

    // Show the raster names underneath each other in the confirm popup
    let rasterNamesWithEnter = "";
    toBeDeletedRasterNamesArray.forEach(function(rasterName) {
      rasterNamesWithEnter += rasterName + " \n ";
    });

    if (
      window.confirm(
        "Are you sure you want to delete the next raster(s)? \n  \n " +
          rasterNamesWithEnter
      )
    ) {
      const url = "/api/v3/rasters/"; // werkt nog niet op api/v4
      for (var i = 0; i < toBeDeletedRasterUuidsArray.length; i++) {
        const opts = {
          // Use PATCH request for deleting rasters, so that the rasters are
          // not permanently deleted
          credentials: "same-origin",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_modifier: "Deleted" // or 9999
          })
        };
        fetch(url + toBeDeletedRasterUuidsArray[i] + "/", opts);
        // Refresh the page, so that the removed rasters are no longer visible
        // fetch is a asynchrounous action. the following line should only be executed on .then. todo fix this
        this.getRastersFromApi(this.state.page, this.state.searchTerms);
      }
    }
  }

  clickRegularCheckbox(e) {
    // Make sure that you can click on the checkbox
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    e.cancelBubble = true;

    // Get the number of the checkbox from the id of the checkbox
    const checkboxId = e.target.id.split("checkbox_")[1];

    let newStateCheckboxes = this.state.checkboxes.slice();
    if (newStateCheckboxes[checkboxId].checked) {
      newStateCheckboxes[checkboxId].checked = false;
    } else {
      newStateCheckboxes[checkboxId].checked = true;
    }

    this.setState({
      checkboxes: newStateCheckboxes
    });
  }

  checkAllCheckBoxes(checkAllCheckBoxes) {
    let checkboxes = this.state.checkboxes.slice();

    checkboxes.map(checkBox => {
      checkBox.checked = checkAllCheckBoxes;
      return checkBox;
    });

    this.setState({
      checkboxes: checkboxes,
      checkAllCheckBoxes: checkAllCheckBoxes
    });
  }

  render() {
    const { rasters, isFetching, total, page } = this.state;

    const numberOfRasters = total;

    const htmlRasterTableHeader = (
      <div className={`${rasterTableStyles.tableHeader}`}>
        <div className={`${rasterTableStyles.tableCheckbox}`}>
          <input
            type="checkbox"
            // Add the checkbox so that the styling of the columns of the
            // table for rasters is consistent, but don't show the checkbox.
            style={{ visibility: "hidden" }}
          />
        </div>
        <div className={`${rasterTableStyles.tableName}`}>Name</div>
        <div className={`${rasterTableStyles.tableDescription}`}>
          Description
        </div>
        <div className={`${rasterTableStyles.tableUpload}`}>Upload</div>
      </div>
    );
    const htmlRasterTableBody = this.state.paginatedRasters.map((raster, i) => {
      return (
        <div className={`${rasterTableStyles.tableBody}`}>
          <div className={`${rasterTableStyles.tableCheckbox}`}>
            <input
              type="checkbox"
              // Make sure that you can still use the checkbox to click on,
              // in combination with the check all checkbox.
              onClick={this.clickRegularCheckbox}
              checked={
                this.state.checkboxes[i]
                  ? this.state.checkboxes[i].checked
                  : false
              }
              id={"checkbox_" + i}
            />
          </div>
          <div className={`${rasterTableStyles.tableName}`}>
            <NavLink
              to={`/data_management/rasters/${raster.uuid}`}
              style={{
                color: "#333"
              }}
            >
              {raster.name}
            </NavLink>
          </div>
          <div className={`${rasterTableStyles.tableDescription}`}>
            <NavLink
              to={`/data_management/rasters/${raster.uuid}`}
              style={{
                color: "#333"
              }}
            >
              {raster.description}
            </NavLink>
          </div>
          <div className={`${rasterTableStyles.tableUpload}`}>
            <NavLink
              to={`/data_management/rasters/${raster.uuid}/data`}
              style={{
                // color: "#333"
              }}
            >
              <img src={uploadIcon} />
            </NavLink>
          </div>
        </div>
      );
    });
    const htmlRasterTableFooter = (
      <div className={`${rasterTableStyles.tableFooter}`}>
        <div className={`${rasterTableStyles.tableCheckbox}`}>
          <input
            type="checkbox"
            // Don't set id to checkbox_[i],
            // otherwise the code will also try to find an accompanying uuid
            // when going over the checked checkboxes and trying to find
            // rasters to delete these rasters.
            id="checkboxCheckAll"
            checked={this.state.checkAllCheckBoxes}
            onClick={e =>
              this.checkAllCheckBoxes(!this.state.checkAllCheckBoxes)}
          />
        </div>
        <div className={`${rasterTableStyles.tableName}`}>
          {this.state.checkAllCheckBoxes
            ? " Uncheck all checkboxes on this page"
            : " Check all checkboxes on this page"}
        </div>
        <div className={`${rasterTableStyles.tableFooterDeleteRasters}`}>
          <button
            type="button"
            className={`${buttonStyles.Button} ${buttonStyles.Danger}`}
            onClick={this.handleDeleteRasterClick}
            style={{ maxHeight: "36px" }}
          >
            <FormattedMessage
              id="rasters.delete_rasters"
              defaultMessage="Delete selected raster(s)"
            />
            <Ink />
          </button>
        </div>
      </div>
    );

    return (
      <div className={rasterTableStyles.tableContainer}>
        <div
          className={gridStyles.Row}
          style={{
            padding: "0 0 30px 0"
          }}
        >
          <div
            className={`${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs8}`}
          >
            <SearchBox
              handleSearch={searchTerms =>
                this.refreshRasterFilteringAndPaginationAndUpdateState(
                  this.state.rasters,
                  1,
                  searchTerms,
                  this.props.organisations.selected
                )}
              searchTerms={this.state.searchTerms}
              setSearchTerms={searchTerms => {
                this.refreshRasterFilteringAndPaginationAndUpdateState(
                  this.state.rasters,
                  1,
                  searchTerms,
                  this.props.organisations.selected
                );
              }}
            />
          </div>
          <div
            className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4}`}
          >
            <button
              type="button"
              style={{ float: "right" }}
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={this.handleNewRasterClick}
            >
              <FormattedMessage
                id="rasters.new_raster"
                defaultMessage="New raster"
              />
              <Ink />
            </button>
          </div>
        </div>
        <div>
          {htmlRasterTableHeader}
          {htmlRasterTableBody}
          {htmlRasterTableFooter}
        </div>
        <div
          className={gridStyles.Row}
          style={{
            margin: "10px 0 0 0",
            padding: "0px 0 0 0"
          }}
        >
          <div
            style={{
              color: "#858E9C"
            }}
            className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4}`}
          >
            <FormattedMessage
              id="rasters.number_of_rasters"
              defaultMessage={`{numberOfRasters, number} {numberOfRasters, plural,
                one {Raster}
                other {Rasters}}`}
              values={{ numberOfRasters }}
            />
          </div>
          <div
            className={`${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs8}`}
          >
            <PaginationBar
              loadRastersOnPage={page =>
                this.refreshRasterFilteringAndPaginationAndUpdateState(
                  this.state.rasters,
                  page,
                  this.state.searchTerms,
                  this.props.organisations.selected
                )}
              page={page}
              pages={Math.ceil(total / this.state.pageSize)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    bootstrap: state.bootstrap,
    organisations: state.organisations
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

Raster = withRouter(connect(mapStateToProps, mapDispatchToProps)(Raster));

export { Raster };

import alarmIcon from "../../images/alarm@3x.svg";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
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
// constante voor page_size?

class Raster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      rasters: [],
      total: 0,
      page: 1,
      checkAllCheckBoxes: false,
      // Add checkbox array with id, raster and whether of not the checkbox
      // is checked, to be able to find the raster back from the checked
      // checkboxes.
      checkboxes: [],
      checkboxAllCheckboxesChecked: false,
      searchTerms: ""
    };
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.handleDeleteRasterClick = this.handleDeleteRasterClick.bind(this);
    this.checkAllCheckBoxes = this.checkAllCheckBoxes.bind(this);
    this.clickRegularCheckbox = this.clickRegularCheckbox.bind(this);
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.loadRastersOnPage = this.loadRastersOnPage.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadRastersOnPage(page, this.state.searchTerms);
  }

  loadRastersOnPage(page, searchContains) {
    const url = searchContains
      ? // ordering is done by filter
        `/api/v3/rasters/?page=${page}&name__icontains=${searchContains}` // &organisation__unique_id=${organisationId},
      : // ordering is done so latest rasters first
        `/api/v3/rasters/?ordering=-last_modified&page=${page}`;

    fetch(url, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetching: false,
          total: data.count,
          rasters: data.results,
          page: page,
          checkAllCheckBoxes: false
        });

        const rasterList = data.results;
        this.resetAllCheckboxes();
        this.setAllCheckBoxes(rasterList);
      });
  }

  setAllCheckBoxes(rasterList) {
    let checkboxes = [];
    for (var i = 0; i < rasterList.length; i++) {
      var newDict = {
        id: i,
        raster: rasterList[i],
        checked: false
      };
      checkboxes.push(newDict);
    }

    this.setState({
      checkboxes: checkboxes,
      checkAllCheckBoxes: false,
      checkboxAllCheckboxesChecked: false
    });
  }

  resetAllCheckboxes() {
    let resetState = Object.assign({}, this.state);
    resetState.checkboxes = [];
    resetState.checkAllCheckBoxes = false;
    resetState.checkboxAllCheckboxesChecked = false;
    this.setState(resetState);
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
        this.setState({
          checkAllCheckBoxes: false,
          checkboxAllCheckboxesChecked: false
        });
        this.checkAllCheckBoxes(false);
        this.loadRastersOnPage(this.state.page, this.state.searchTerms);
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

  checkAllCheckBoxes(checkboxAllCheckboxesChecked) {
    let checkboxes = this.state.checkboxes.slice();

    checkboxes.map(checkBox => {
      checkBox.checked = checkboxAllCheckboxesChecked;
      return checkBox;
    });

    this.setState({
      checkboxes: checkboxes,
      checkAllCheckBoxes: checkboxAllCheckboxesChecked,
      checkboxAllCheckboxesChecked: checkboxAllCheckboxesChecked // nog nodig?
    });
  }

  render() {
    const { rasters, isFetching, total, page } = this.state;

    const numberOfRasters = total;

    const htmlRasterTableHeader = (
      <div
        // className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${
        //   gridStyles.colSm12
        // } ${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs8}`}
        className={`${gridStyles.Row} ${styles.RasterTableHeader}`}
      >
        <div
          className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
        >
          <FormattedMessage
            id="rasters.header_raster_name"
            defaultMessage="Raster name"
          />
        </div>
        <div
          className={`${gridStyles.colLg3} ${gridStyles.colMd3} ${gridStyles.colSm3} ${gridStyles.colXs3}`}
          style={{ float: "right" }}
        >
          <FormattedMessage
            id="rasters.header_raster_description"
            defaultMessage="Description"
          />
        </div>
        <div
          className={`${gridStyles.colLg3} ${gridStyles.colMd3} ${gridStyles.colSm3} ${gridStyles.colXs3}`}
          style={{ float: "right", textAlign: "right" }}
        >
          <FormattedMessage
            id="rasters.click_to_adapt_data"
            defaultMessage="Data"
          />
        </div>
      </div>
    );
    const htmlRasterTable = rasters.map((raster, i) => {
      return (
        <Row key={i} alarm={raster}>
          <span className={"col-lg-6 col-md-6 col-sm-6 col-xs-6"}>
            <label>
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
              {
                " " // empty space between checkbox and raster.name
              }
              <NavLink
                to={`/data_management/rasters/${raster.uuid}`}
                style={{
                  color: "#333"
                }}
              >
                {raster.name}
              </NavLink>
            </label>
          </span>
          <span className={"col-lg-3 col-md-3 col-sm-3 col-xs-3"}>
            <NavLink
              to={`/data_management/rasters/${raster.uuid}`}
              style={{
                color: "#333"
              }}
            >
              {raster.description}
            </NavLink>
          </span>
          <div
            className={`${gridStyles.colLg3} ${gridStyles.colMd3} ${gridStyles.colSm3} ${gridStyles.colXs3}`}
            style={{ float: "right", textAlign: "right" }}
          >
            <NavLink
              to={`/data_management/rasters/${raster.uuid}/data`}
              style={{
                // color: "#333"
              }}
            >
              <FormattedMessage
                id="rasters.link_to_upload_data"
                defaultMessage="Upload"
              />
            </NavLink>
          </div>
        </Row>
      );
    });
    const htmlRasterTableFooter = ( // line above instead of beneath div
      // https://stackoverflow.com/questions/32174317/how-to-set-default-checked-in-checkbox-reactjs
      <div
        className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12} ${styles.RasterTableFooter}`}
      >
        <span
          className={`${gridStyles.colLg1} ${gridStyles.colMd1} ${gridStyles.colSm1} ${gridStyles.colXs1}`}
        >
          <label>
            <input
              type="checkbox"
              // Don't set id to checkbox_[i],
              // otherwise the code will also try to find an accompanying uuid
              // when going over the checked checkboxes and trying to find
              // rasters to delete these rasters.
              id="checkboxCheckAll"
              checked={this.state.checkboxAllCheckboxesChecked}
              onClick={e =>
                this.checkAllCheckBoxes(
                  !this.state.checkboxAllCheckboxesChecked
                )}
            />
            {this.state.checkAllCheckBoxes
              ? " Uncheck all checkboxes on this page"
              : " Check all checkboxes on this page"}
          </label>
        </span>
        <span
          className={`${gridStyles.colLg11} ${gridStyles.colMd11} ${gridStyles.colSm11} ${gridStyles.colXs11}`}
        >
          <button
            type="button"
            style={{ float: "right" }}
            className={`${buttonStyles.Button} ${buttonStyles.Danger}`}
            onClick={this.handleDeleteRasterClick}
          >
            <FormattedMessage
              id="rasters.delete_rasters"
              defaultMessage="Delete selected raster(s)"
            />
            <Ink />
          </button>
        </span>
      </div>
    );

    return (
      <div className={gridStyles.Container}>
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
              handleSearch={searchContains =>
                this.loadRastersOnPage(this.state.page, searchContains)}
              searchTerms={this.state.searchTerms}
              setSearchTerms={searchTerms => this.setState({ searchTerms })}
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
        {htmlRasterTableHeader}
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            {isFetching ? (
              <div
                style={{
                  position: "relative",
                  top: 50,
                  height: 300,
                  bottom: 50,
                  marginLeft: "50%"
                }}
              >
                <MDSpinner size={24} />
              </div>
            ) : rasters.length > 0 ? (
              htmlRasterTable
            ) : (
              <div className={styles.NoResults}>
                <img src={alarmIcon} alt="Alarms" />
                <h5>
                  <FormattedMessage
                    id="rasters.no_rasters"
                    defaultMessage="No rasters configured..."
                  />
                </h5>
              </div>
            )}
          </div>
        </div>
        {htmlRasterTableFooter}
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
                this.loadRastersOnPage(page, this.state.searchTerms)}
              page={page}
              pages={Math.ceil(total / 10)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    bootstrap: state.bootstrap
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

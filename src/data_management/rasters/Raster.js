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
// constante voor page_size

class Raster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      rasters: [],
      total: 0,
      page: 1,
      checkAllCheckBoxes: false,
      // Add raster uuid and raster name to the checkboxes dict,
      // to be able to find the raster back from the checked checkboxes.
      checkboxes: [],
      checkboxAllCheckboxesChecked: false
    };
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.handleDeleteRasterClick = this.handleDeleteRasterClick.bind(this);
    this.checkAllCheckBoxes = this.checkAllCheckBoxes.bind(this);
    this.clickRegularCheckbox = this.clickRegularCheckbox.bind(this);
    this.loadRastersOnPage = this.loadRastersOnPage.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadRastersOnPage(page);
  }

  loadRastersOnPage(page, searchContains) {
    console.log("loadRastersOnPage");
    const url = searchContains
      ? `/api/v3/rasters/?page=${page}&name__icontains=${searchContains}` // &organisation__unique_id=${organisationId},
      : `/api/v3/rasters/?page=${page}`;

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

        // Clear the checkboxes
        this.resetAllCheckboxes();
        // Set the checkboxes with the new results.
        console.log("rasterList", rasterList);
        this.setAllCheckBoxes(rasterList);
      });
    console.log("this.state", this.state);
  }

  setAllCheckBoxes(rasterList) {
    console.log("rasterList", rasterList);
    // let newState = Object.assign({}, this.state);
    let checkboxes = [];
    for (var i = 0; i < rasterList.length; i++) {
      var newDict = {
        id: i,
        raster: rasterList[i],
        checked: false
      };
      checkboxes.push(newDict);
    }
    // newState.checkboxes = checkboxes;
    // this.setState(newState);
    this.setState({
      checkboxes: checkboxes,
      checkAllCheckBoxes: false,
      checkboxAllCheckboxesChecked: false
    });
    console.log("this.state", this.state);
  }

  resetAllCheckboxes() {
    let resetState = Object.assign({}, this.state);
    resetState.checkboxes = [];

    this.setState(resetState);
    this.setState({
      checkAllCheckBoxes: false,
      checkboxAllCheckboxesChecked: false
    });
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
        console.log("toBeDeletedRasterNamesArray", toBeDeletedRasterNamesArray);
        toBeDeletedRasterUuidsArray.push(checkbox.raster.uuid);
        console.log("toBeDeletedRasterUuidsArray", toBeDeletedRasterUuidsArray);
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
          rasterNamesWithEnter //make rows.
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
        this.loadRastersOnPage(this.state.page);
      }
    }
  }

  clickRegularCheckbox(e) {
    // Make sure that you can click on the checkbox
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    e.cancelBubble = true;

    // Get the number of the checkbox in the array of this.state.checkboxes
    const checkboxId = e.target.id.split("checkbox_")[1];
    // and set the checked value to false/ true.
    let newStateCheckboxes = this.state.checkboxes.slice(); //Object.assign({}, this.state.checkboxes);
    if (newStateCheckboxes[checkboxId].checked) {
      newStateCheckboxes[checkboxId].checked = false;
    } else {
      newStateCheckboxes[checkboxId].checked = true;
    }
    this.setState({
      checkboxes: newStateCheckboxes
    });
    console.log("this.state", this.state);
  }

  checkAllCheckBoxes(checkboxAllCheckboxesChecked) {
    // parameter meegeven!

    let checkboxes = this.state.checkboxes.slice(); // Object.assign({}, this.state.checkboxes);
    console.log("checkboxes", checkboxes);
    console.log("checkboxes.length", checkboxes.length); //newState weg

    // if (this.state.checkAllCheckBoxes) {
    //   for (var i = 0; i < newState.checkboxes.length; i++) {
    //     newState.checkboxes[i].checked = false;
    //   }
    // } else {
    //   for (var i = 0; i < newState.checkboxes.length; i++) {
    //     newState.checkboxes[i].checked = true;
    //   }
    // }
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
        className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12} ${styles.RasterTableHeader}`}
      >
        <span
          className={`${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs8}`}
        >
          <FormattedMessage
            id="rasters.header_raster_name"
            defaultMessage="Raster name"
          />
        </span>
        <span
          className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4}`}
          style={{ float: "right" }}
        >
          <FormattedMessage
            id="rasters.header_raster_description"
            defaultMessage="Description"
          />
        </span>
      </div>
    );
    const htmlRasterTable = rasters.map((raster, i) => {
      return (
        <Row key={i} alarm={raster} loadRastersOnPage={this.loadRastersOnPage}>
          <span
            className={"col-lg-9 col-md-9 col-sm-9 col-xs-9"} // werkt niet goed, ligt aan lokale styling?
            // style={{ float: "left" }}
          >
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
                // Pay attention: a rastername can include an underscore.
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
          <span
            className={"col-lg-3 col-md-3 col-sm-3 col-xs-3"} // werkt niet goed, ligt aan lokale styling?
            // style={{ float: "right" }}
          >
            <NavLink
              to={`/data_management/rasters/${raster.uuid}`}
              style={{
                color: "#333"
              }}
            >
              {raster.description}
            </NavLink>
          </span>
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
              // Don't set id to [i]_checkbox_["something"],
              // otherwise the code will also try to find an accompanying uuid
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
              loadRastersOnPage={this.loadRastersOnPage}
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

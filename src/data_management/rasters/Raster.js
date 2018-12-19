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

class Raster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      rasters: [],
      total: 0,
      page: 1,
      checkAllCheckBoxes: false
    };
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.handleDeleteRasterClick = this.handleDeleteRasterClick.bind(this);
    this.checkAllCheckBoxes = this.checkAllCheckBoxes.bind(this);
    this.loadRastersOnPage = this.loadRastersOnPage.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadRastersOnPage(page);
  }

  loadRastersOnPage(page, searchContains) {
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
      });
  }

  handleNewRasterClick() {
    const { history } = this.props;
    history.push("/data_management/rasters/new");
  }

  handleDeleteRasterClick() {
    var toBeDeletedRasterNamesArray = [];
    var toBeDeletedRasterUuidsArray = [];
    var checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].id.indexOf("checkbox_") > -1) {
        let selectedUuid = checkboxes[i].id.split("checkbox_")[1];
        console.log("checkboxes[i]", checkboxes[i]);
        console.log(
          "checkboxes[i].parentNode.childNodes[2].innerHTML",
          checkboxes[i].parentNode.childNodes[2].innerHTML
        );
        toBeDeletedRasterNamesArray.push(
          checkboxes[i].parentNode.childNodes[2].innerHTML
        );
        toBeDeletedRasterUuidsArray.push(selectedUuid);
      }
    }

    if (
      window.confirm(
        "Are you sure you want to delete the next raster(s)? \n  \n " +
          toBeDeletedRasterNamesArray
      )
    ) {
      const url = "/api/v3/rasters/";
      document.getElementById("checkboxCheckAll").checked = false;
      for (var i = 0; i < toBeDeletedRasterUuidsArray.length; i++) {
        document.getElementById(
          "checkbox_" + toBeDeletedRasterUuidsArray[i]
        ).checked = false;
        const opts = {
          // Use PATCH request for deleting rasters, so that the rasters are
          // not permanently deleted
          credentials: "same-origin",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_modifier: "Deleted" // 9999
          })
        };
        fetch(url + toBeDeletedRasterUuidsArray[i] + "/", opts);
        console.log("Deleted raster " + toBeDeletedRasterUuidsArray[i]);
        // Refresh the page, so that the removed rasters are not anymore visible
        this.setState({
          checkAllCheckBoxes: false
        });
        this.loadRastersOnPage(this.state.page);
      }
    }
  }

  checkAllCheckBoxes() {
    var checkboxes = document.querySelectorAll("input[type=checkbox]");

    if (this.state.checkAllCheckBoxes) {
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      this.setState({
        checkAllCheckBoxes: false
      });
    } else {
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = true;
      }
      this.setState({
        checkAllCheckBoxes: true
      });
    }
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
                // onClick={"if(event.stopPropagation){event.stopPropagation();}event.cancelBubble=true;"}
                // checked={this.state.checkbox[i]}
                id={"checkbox_" + raster.uuid}
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
              id="checkboxCheckAll"
              // checked={false}
              onClick={this.checkAllCheckBoxes}
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

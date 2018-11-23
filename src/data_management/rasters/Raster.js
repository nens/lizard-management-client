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

class Raster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      rasters: [],
      total: 0,
      page: 1
    };
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.loadRastersOnPage = this.loadRastersOnPage.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadRastersOnPage(page);
  }

  loadRastersOnPage(page) {
    fetch(
      `/api/v3/rasters/?page=${page}`, // &organisation__unique_id=${organisationId},
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({
          isFetching: false,
          total: data.count,
          rasters: data.results,
          page: page
        });
      });
  }

  handleNewRasterClick() {
    const { history } = this.props;
    history.push("/data_management/rasters/new");
  }

  sortList(list) {
    const sortedList = list
      .slice()
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      .sort((a, b) => {
        return a.active === b.active ? 0 : a.active ? -1 : 1;
      });
    return sortedList;
  }

  render() {
    const { rasters, isFetching, total, page } = this.state;

    const numberOfRasters = total;
    const rasterRows = this.sortList(rasters);

    const htmlRasterTableHeader = (
      <div
        className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
        style={{
          padding: "0 0 15px 0",
          borderBottom: "1px solid #bababa",
          color: "#858e9c"
        }}
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
    const htmlRasterTable = rasterRows.map((raster, i) => {
      return (
        <Row key={i} alarm={raster} loadRastersOnPage={this.loadRastersOnPage}>
          <NavLink
            to={`/data_management/rasters/${raster.uuid}`}
            style={{
              color: "#333"
            }}
          >
            {raster.name}
          </NavLink>
          <NavLink
            to={`/data_management/rasters/${raster.uuid}`}
            style={{
              color: "#333"
            }}
          >
            {raster.description}
          </NavLink>
        </Row>
      );
    });

    return (
      <div className={gridStyles.Container}>
        <div
          className={gridStyles.Row}
          style={{
            padding: "0 0 30px 0"
          }}
        >
          <div
            style={{ color: "#858E9C" }}
            className={`${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs8}`}
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
            ) : rasterRows.length > 0 ? (
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
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
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

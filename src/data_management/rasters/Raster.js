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
      searchTerms: ""
    };
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.loadRastersOnPage = this.loadRastersOnPage.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.loadRastersOnPage(page);
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
          page: page
        });
      });
  }

  handleNewRasterClick() {
    const { history } = this.props;
    history.push("/data_management/rasters/new");
  }

  render() {
    const { rasters, isFetching, total, page } = this.state;

    const numberOfRasters = total;

    const htmlRasterTableHeader = (
      <div
        // className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${
        //   gridStyles.colSm12
        // } ${gridStyles.colXs12} ${styles.RasterTableHeader}`}
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
        // <Row
        //   key={i}
        //   alarm={raster}
        //   // loadRastersOnPage={this.loadRastersOnPage}
        // >
        // <NavLink
        //   to={`/data_management/rasters/${raster.uuid}`}
        //   style={{
        //     color: "#333"
        //   }}
        // >
        //   {raster.name}
        // </NavLink>
        //   <NavLink
        //     to={`/data_management/rasters/${raster.uuid}`}
        //     style={{
        //       color: "#333"
        //     }}
        //   >
        //     {raster.description}
        //   </NavLink>
        // </Row>
        <div
          className={`${gridStyles.Row}`}
          style={{
            marginTop: "10px"
          }}
        >
          <div
            className={`${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
          >
            <NavLink
              to={`/data_management/rasters/${raster.uuid}`}
              style={{
                color: "#333"
              }}
            >
              {raster.name}
            </NavLink>
          </div>
          <div
            className={`${gridStyles.colLg3} ${gridStyles.colMd3} ${gridStyles.colSm3} ${gridStyles.colXs3}`}
            style={{ float: "right" }}
          >
            <NavLink
              to={`/data_management/rasters/${raster.uuid}`}
              style={{
                color: "#333"
              }}
            >
              {raster.description}
            </NavLink>
          </div>
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
                defaultMessage="Load"
              />
            </NavLink>
          </div>
        </div>
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
        <div
          className={gridStyles.Row}
          style={{
            borderTop: "1px solid #BABABA",
            margin: "30px 0 0 0",
            padding: "30px 0 0 0"
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

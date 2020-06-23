import rasterIcon from "../../images/rasters@3x.svg";
import buttonStyles from "../../styles/Buttons.css";
import rasterTableStyles from "../../styles/RasterWmsTable.css";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import PaginationBar from "./PaginationBar";
import React, { Component } from "react";
import styles from "./App.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import { listRastersForTable, flushRasters, deleteRasters } from "../../api/rasters";


class Raster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: false,
      rasters: [],
      total: 0,
      page: 1,
      pageSize: 10,
      checkAllCheckBoxes: false,
      // Add checkbox array with id, raster and whether of not the checkbox
      // is checked, to be able to find the raster back from the checked checkboxes.
      checkboxes: [],
      searchTerms: "",
      searchedTerms: "",
    };
    this.handleNewRasterClick = this.handleNewRasterClick.bind(this);
    this.handleDeleteRasterClick = this.handleDeleteRasterClick.bind(this);
    this.handleFlushDataRasterClick = this.handleFlushDataRasterClick.bind(this);
    this.checkAllCheckBoxes = this.checkAllCheckBoxes.bind(this);
    this.clickRegularCheckbox = this.clickRegularCheckbox.bind(this);
    this.handleUpdatePage = this.handleUpdatePage.bind(this);
    this.handleUpdateSearchTerms = this.handleUpdateSearchTerms.bind(this);
    this.handleUpdateSearchedTermsEnter = this.handleUpdateSearchedTermsEnter.bind(this);
    this.handleUpdateSearchedTermsOnBlur = this.handleUpdateSearchedTermsOnBlur.bind(this);
    this.handleUpdateSearchedTermsClear = this.handleUpdateSearchedTermsClear.bind(this);
  }

  componentDidMount() {
    this.fetchRastersFromApi(
      this.state.page,
      this.state.searchTerms,
      this.props.organisations.selected
    );
  }
  componentWillUpdate(nextProps, nextState) {
    if (nextProps.organisations.selected.uuid !== this.props.organisations.selected.uuid) {
      this.updatePageAndFetchRastersFromApi(
        1,
        this.state.searchedTerms,
        nextProps.organisations.selected
      )
    }

    if (nextState.searchedTerms !== this.state.searchedTerms) {
      this.updatePageAndFetchRastersFromApi(
        1,
        nextState.searchedTerms,
        this.props.organisations.selected
      );
    } else if (nextState.page !== this.state.page) {
      this.fetchRastersFromApi(
        nextState.page,
        this.state.searchedTerms,
        this.props.organisations.selected
      );
    }
  }

  updatePageAndFetchRastersFromApi(page, searchedTerms, organisation) {
    this.setState(
      {
        page: page
      },
      this.fetchRastersFromApi(
        page,
        searchedTerms,
        organisation
      )
    );
  }

  handleUpdatePage(page) {
    this.setState({
      page: page
    });
  }
  handleUpdateSearchTerms(searchTerms) {
    this.setState({
      searchTerms: searchTerms,
    });
  }
  handleUpdateSearchedTermsEnter() {
    this.setState({
      searchedTerms: this.state.searchTerms,
      page: 1 // Reset PaginationBar to page 1
    });
  }
  handleUpdateSearchedTermsOnBlur() {
    this.setState({
      searchedTerms: this.state.searchTerms,
    });
  }
  handleUpdateSearchedTermsClear() {
    this.setState({
      searchTerms: "",
      searchedTerms: "",
      page: 1 // Reset PaginationBar to page 1
    });
  }

  fetchRastersFromApi(page, searchContains, organisation) {
    this.setState({
      isFetching: true
    });

    listRastersForTable(
      this.state.pageSize, page, searchContains, organisation.uuid
    ).then(rasters => {
      const checkboxes = this.createCheckboxDataFromRaster(rasters);
      this.setState({
        rasters: rasters,
        checkAllCheckBoxes: false,
        checkboxes: checkboxes,
        isFetching: false,
        total: data.count,
      });
    });
  }

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
    if (
      window.confirm(
        "Are you sure you want to delete the next raster(s)? \n  \n " +
        this.state.checkboxes.filter(checkbox => checkbox.checked).map(checkbox=>checkbox.raster.name).join(" \n")
      )
    ) {
      const checkedUuids = this.state.checkboxes.filter(checkbox => checkbox.checked).map(checkbox=>checkbox.raster.uuid);
      deleteRasters(checkedUuids).then(() => {
        // Refresh the page, so that the removed rasters are no longer visible
        this.fetchRastersFromApi(
          this.state.page,
          this.state.searchTerms,
          this.props.organisations.selected
        );
      });
    }
  }

  handleFlushDataRasterClick() {
    if (
      window.confirm(
        "Are you sure you want to remove all data in the next raster(s)? \n  \n " +
        this.state.checkboxes.filter(checkbox => checkbox.checked).map(checkbox=>checkbox.raster.name).join(" \n")
      )
    ) {
      const checkedUuids = this.state.checkboxes.filter(checkbox => checkbox.checked).map(checkbox=>checkbox.raster.uuid);
      flushRasters(checkedUuids).then(() => {
        // Refresh the page, so that the removed rasters are no longer visible
        this.fetchRastersFromApi(
          this.state.page,
          this.state.searchTerms,
          this.props.organisations.selected
        );
      });
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
    const { total } = this.state;
    const placeholderForRasterSearch = this.props.intl.formatMessage({
      id: "searchbox.raster_placeholder",
      defaultMessage: "search for name or user"
    });
    const clickedCheckboxes = this.state.checkboxes.filter(e => e.checked).length;

    const numberOfRasters = total;

    const htmlRasterTableHeader = (
      <div className={`${rasterTableStyles.tableHeader}`}>
        <div className={`${rasterTableStyles.tableCheckbox}`}>
          {/*Don't set id to checkbox_[i],
             otherwise the code will also try to find an accompanying uuid
            when going over the checked checkboxes and trying to find
            rasters to delete these rasters. */}
          <input
            type="checkbox"
            id="checkboxCheckAll"
            checked={this.state.checkAllCheckBoxes}
            onChange={e =>
              this.checkAllCheckBoxes(!this.state.checkAllCheckBoxes)}
          />
        </div>
        <div className={`${rasterTableStyles.tableName}`}>
          <FormattedMessage id="rasters.raster_name" defaultMessage="Name" />
        </div>
        <div className={`${rasterTableStyles.tableDescription}`}>
          <FormattedMessage
            id="rasters.raster_description"
            defaultMessage="Description"
          />
        </div>
        <div className={`${rasterTableStyles.TableSupplier}`}>
          <FormattedMessage
            id="rasters.raster_suppliercode"
            defaultMessage="Supplier Code"
          />
        </div>
        <div className={`${rasterTableStyles.TableObservationType}`}>
          <FormattedMessage
            id="rasters.raster_observationtype"
            defaultMessage="Observation type"
          />
        </div>
        <div className={`${rasterTableStyles.tableUpload}`}>Upload</div>
      </div>
    );

    const htmlRasterTableBody = (
      <div
        style={{
          position: "relative"
        }}
      >
        <div
          style={{
            visibility: this.state.isFetching ? "hidden" : "visible"
          }}
        >
          <Scrollbars
            autoHeight
            autoHeightMin={450}
            autoHeightMax={450}
            style={{ minWidth: 800 }}
            renderTrackHorizontal={props => <div {...props} style={{display: 'none'}} className="track-horizontal"/>}
          >
            {this.state.rasters.map((raster, i) => {
              return (
                <div className={`${rasterTableStyles.tableBody}`} key={raster.uuid}>
                  <div className={`${rasterTableStyles.tableCheckbox}`}>
                    <input
                      type="checkbox"
                      // Make sure that you can still use the checkbox to click on,
                      // in combination with the check all checkbox.
                      onChange={this.clickRegularCheckbox}
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
                      style={{ color: "#333" }}
                    >
                      {raster.name}
                    </NavLink>
                  </div>
                  <div className={`${rasterTableStyles.tableDescription}`}>
                    <NavLink
                      to={`/data_management/rasters/${raster.uuid}`}
                      style={{ color: "#333" }}
                    >
                      {raster.description}
                    </NavLink>
                  </div>
                  <div className={`${rasterTableStyles.TableSupplier}`}>
                    {raster.supplier_code}
                  </div>
                  <div className={`${rasterTableStyles.TableObservationType}`}>
                    {raster.observation_type && raster.observation_type.code}
                  </div>
                  <div className={`${rasterTableStyles.tableUpload}`}>
                    {/* raster.source contains the metadata of the raster data */}
                    {/* if source is null no data is yet uploaded to the raster */}
                    {raster.source === null ? (
                      <NavLink
                        to={`/data_management/rasters/${raster.uuid}/data`}
                      >
                        <i
                          className="material-icons"
                          style={{ color: "#989898" }}
                          title="No data uploaded yet"
                        >
                          cloud_upload
                        </i>
                      </NavLink>
                    ) : // if raster.data.name contains "Optimizer OR "RasterStoreSource" then there is already data in the raster and the user is also allowed to update this
                    raster.source.name.split("_")[0] === "Optimizer" ||
                    raster.source.name.split("_")[0] === "RasterStoreSource" ? (
                      <NavLink
                        to={`/data_management/rasters/${raster.uuid}/data`}
                      >
                        <i
                          className="material-icons"
                          style={{ color: "#009F86" }}
                          title="Data is uploaded"
                        >
                          cloud_upload
                        </i>
                      </NavLink>
                    ) : (
                      // in any other cases there is data in the raster, but this is generated/calculated data. The user is not allowed to update it. The user should update the rasters that act as the source for the calculations instead
                      <i
                        className="material-icons"
                        style={{
                          color: "#989898",
                          cursor: "not-allowed"
                        }}
                        title="Uploading data not allowed for derived rasters"
                      >
                        cloud_off
                      </i>
                    )}
                  </div>
                </div>
              );
            })}
          </Scrollbars>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            visibility: this.state.isFetching ? "visible" : "hidden"
          }}
        >
          <MDSpinner />
        </div>
        <div
          className={styles.NoResults}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            visibility:
              this.state.isFetching === false && this.state.rasters.length === 0
                ? "visible"
                : "hidden"
          }}
        >
          <img src={rasterIcon} alt="Alarms" />
          <h5>
            <FormattedMessage
              id="rasters.no_rasters"
              defaultMessage="No rasters found..."
            />
          </h5>
        </div>
      </div>
    );

    const htmlRasterTableFooter = (
      <div className={`${rasterTableStyles.tableFooter}`}>
        <div className={`${rasterTableStyles.tableFooterLeftFiller}`} />
        <div className={`${rasterTableStyles.tableInfoAndPagination}`}>
          <PaginationBar
            loadRastersOnPage={page => this.handleUpdatePage(page)}
            page={this.state.page}
            pages={Math.ceil(this.state.total / this.state.pageSize)}
          />
          <div className={`${rasterTableStyles.tableFooterNumberOfRasters}`}>
            <FormattedMessage
              id="rasters.number_of_rasters"
              defaultMessage={`{numberOfRasters, number} {numberOfRasters, plural,
            one {Raster}
            other {Rasters}}`}
              values={{ numberOfRasters }}
            />
          </div>
        </div>
        <div className={`${rasterTableStyles.tableFooterDeleteRasters}`}>
          <div>
            <button
              type="button"
              className={
                clickedCheckboxes > 0
                  ? `${buttonStyles.Button} ${buttonStyles.Danger}`
                  : `${buttonStyles.Button} ${buttonStyles.Inactive}`
              }
              onClick={this.handleFlushDataRasterClick}
              style={{ maxHeight: "36px", width: "220px",marginRight: "10px" }}
              disabled={clickedCheckboxes === 0 ? true : false}
            >
              <FormattedMessage
                id="rasters.flush_data_rasters"
                defaultMessage={` Flush data {clickedCheckboxes, number} {clickedCheckboxes, plural,
                  one {Raster}
                  other {Rasters}}`}
                values={{
                  clickedCheckboxes
                }}
              />
              <Ink />
            </button>
            <button
              type="button"
              className={
                clickedCheckboxes > 0
                  ? `${buttonStyles.Button} ${buttonStyles.Danger}`
                  : `${buttonStyles.Button} ${buttonStyles.Inactive}`
              }
              onClick={this.handleDeleteRasterClick}
              style={{ maxHeight: "36px", width: "220px" }}
              disabled={clickedCheckboxes === 0 ? true : false}
            >
              <FormattedMessage
                id="rasters.delete_rasters"
                defaultMessage={` Delete {clickedCheckboxes, number} {clickedCheckboxes, plural,
                  one {Raster}
                  other {Rasters}}`}
                values={{
                  clickedCheckboxes
                }}
              />
              <Ink />
            </button>
          </div>
        </div>
      </div>
    );

    return (
      <div className={rasterTableStyles.tableContainer}>
        <div
          className={rasterTableStyles.tableSearch}
          style={{
            padding: "0 0 30px 0"
          }}
        >
          <div>
            <div className={rasterTableStyles.tableSearchTop}>
              <SearchBox
                handleSearchEnter={searchTerms => {
                  this.handleUpdateSearchedTermsEnter();
                }}
                handleSearchOnBlur={searchTerms => {
                  this.handleUpdateSearchedTermsOnBlur();
                }}
                handleSearchClear={searchTerms => {
                  this.handleUpdateSearchedTermsClear();
                }}
                searchTerms={this.state.searchTerms}
                setSearchTerms={searchTerms => {
                  this.handleUpdateSearchTerms(searchTerms);
                }}
                placeholder={placeholderForRasterSearch}
              />
            </div>
          </div>
          <div>
            <button
              type="button"
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
          <Scrollbars
            autoHeight
            autoHeightMax={500}
            autoHeightMin={500}
            renderTrackVertical={props => <div {...props} style={{display: 'none', overflowY: "hidden"}} className="track-vertical"/>}
          >
            {htmlRasterTableHeader}
            {htmlRasterTableBody}
          </Scrollbars>
          {htmlRasterTableFooter}
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

Raster = withRouter(connect(mapStateToProps, mapDispatchToProps)(injectIntl(Raster)));

export { Raster };

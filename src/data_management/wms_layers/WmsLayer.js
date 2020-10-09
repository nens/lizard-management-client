import wmsIcon from "../../images/wms@3x.svg";
import buttonStyles from "../../styles/Buttons.module.css";
import gridStyles from "../../styles/Grid.module.css";
import wmsLayerTableStyles from "../../styles/RasterWmsTable.module.css";
import Ink from "react-ink";
import MDSpinner from "react-md-spinner";
import { Scrollbars } from "react-custom-scrollbars";
import PaginationBar from "./PaginationBar";
import React, { Component } from "react";
import styles from "../rasters/App.module.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SearchBox from "../../components/SearchBox";


class WmsLayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      wmsLayers: [],
      filteredSortedWmsLayers: [],
      paginatedWmsLayers: [],
      total: 0,
      page: 1,
      pageSize: 10,
      checkAllCheckBoxes: false,
      // Add checkbox array with id, wmsLayer and whether of not the checkbox
      // is checked, to be able to find the wmsLayer back from the checked checkboxes.
      checkboxes: [],
      searchTerms: "",
    };
    this.handleNewWmsLayerClick = this.handleNewWmsLayerClick.bind(this);
    this.handleDeleteWmsLayerClick = this.handleDeleteWmsLayerClick.bind(this);
    this.checkAllCheckBoxes = this.checkAllCheckBoxes.bind(this);
    this.clickRegularCheckbox = this.clickRegularCheckbox.bind(this);
  }
  componentDidMount() {
    const { page } = this.state;
    this.getWmsLayersFromApi(
      page,
      this.state.searchTerms
    );
  }
  
  componentWillUpdate(nextProps, nextState) {
    
    if (
      this.props.organisations.selected.uuid !==
      nextProps.organisations.selected.uuid
    ) {
      let page = 1;
      this.refreshWmsLayerFilteringAndPaginationAndUpdateState(
        nextState.wmsLayers,
        page,
        nextState.searchTerms,
        nextProps.organisations.selected.uuid,
      );
    }

    
  }

  filterSortWmsLayers = (wmsLayers, searchContains, selectedOrganisationUuid) => {
    const filteredWmsLayers = wmsLayers.filter(
      e =>
        ((e.name || "").toLowerCase().includes(searchContains.toLowerCase()) ||
          (e.description || "")
            .toLowerCase()
            .includes(searchContains.toLowerCase()) ||
          (e.uuid || "")
            .toLowerCase()
            .includes(searchContains.toLowerCase()))
          &&
            // also sort on organisation, but remove slash from organisation uuid
            (e.organisation && e.organisation.uuid.split('-').join('')) === selectedOrganisationUuid
    );

    filteredWmsLayers.sort((a, b) => {
      if (a.last_modified === null) {
        return 1;
      } else if (b.last_modified === null) {
        return -1;
      } else if (a.last_modified > b.last_modified) {
        return -1;
      } else {
        return 1;
      }
    });
    return filteredWmsLayers;
  };

  paginateWmsLayers = (wmsLayers, page) => {
    const paginatedWmsLayers = wmsLayers.slice(
      this.state.pageSize * (page - 1),
      this.state.pageSize * page
    );
    return paginatedWmsLayers;
  };

  refreshWmsLayerFilteringAndPaginationAndUpdateState = (
    wmsLayers,
    page,
    searchTerms,
    selectedOrganisationUuid
  ) => {
    const filteredSortedWmsLayers = this.filterSortWmsLayers(
      wmsLayers,
      searchTerms,
      selectedOrganisationUuid
    );
    const paginatedWmsLayers = this.paginateWmsLayers(filteredSortedWmsLayers, page);
    const checkboxes = this.createCheckboxDataFromWmsLayer(paginatedWmsLayers);
    
    this.setState({
      isFetching: false,
      total: filteredSortedWmsLayers.length,
      wmsLayers: wmsLayers,
      filteredSortedWmsLayers: filteredSortedWmsLayers,
      paginatedWmsLayers: paginatedWmsLayers,
      page: page,
      checkAllCheckBoxes: false,
      checkboxes: checkboxes,
      searchTerms: searchTerms
    });
  };
  getWmsLayersFromApi = (page, searchContains) => {
    // searching/filtering/pagination is for now done clientside so server side search is commented out

    const url = "/api/v4/wmslayers/?page_size=100000";

    this.setState({
      isFetching: true
    });

    fetch(url, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => {
        const wmsLayers = data.results;
        this.refreshWmsLayerFilteringAndPaginationAndUpdateState(
          wmsLayers,
          page,
          searchContains,
          this.props.organisations.selected.uuid
        );
      });
  };

  handleNewWmsLayerClick() {
    const { history } = this.props;
    history.push("/data_management/wms_layers/new");
  }

  createCheckboxDataFromWmsLayer(wmsLayerList) {
    let checkboxes = [];
    for (var i = 0; i < wmsLayerList.length; i++) {
      var newDict = {
        id: i,
        wmsLayer: wmsLayerList[i],
        checked: false
      };
      checkboxes.push(newDict);
    }
    return checkboxes;
  }

  handleDeleteWmsLayerClick() {
    if (
      window.confirm(
        "Are you sure you want to delete the next wms layer(s)? \n  \n " +
        this.state.checkboxes.filter(checkbox => checkbox.checked).map(checkbox=>checkbox.wmsLayer.name).join(" \n")
      )
    ) {
      const checkedUuids = this.state.checkboxes.filter(checkbox => checkbox.checked).map(checkbox=>checkbox.wmsLayer.uuid);
      const opts = {
        // not permanently deleted, this will be implemented in backend
        credentials: "same-origin",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      };
      this.fetchWmsLayerUuidsWithOptions(checkedUuids, opts);
    }
  }

  fetchWmsLayerUuidsWithOptions(uuids, fetchOptions) {
    const url = "/api/v4/wmslayers/";
    // array to store all fetches to later resolve all promises
    const fetches = uuids.map (wmsLayerUuid => {
      return (fetch(url + wmsLayerUuid + "/", fetchOptions));
    });
    Promise.all(fetches).then(values => {
      // Refresh the page, so that the removed wmsLayers are no longer visible
      this.getWmsLayersFromApi(
        this.state.page,
        this.state.searchTerms,
      );
    });
    // TODO show user results of the fetch
    // this function should probably be changed to a async function and then the calling function should do the notification
    // the addNotification seems not to support translation and also may not be suitable for long text
    // should we use modal instead ?
    // const valuesWithWmsLayers = values.map((el, ind)=> {return{
    //   promise: el,
    //   wmsLayerUuid: this.state.wmsLayers.find(e=> e.uuid === toBeDeletedwmsLayerUuidsArray[ind])
    // }});
    // const failedDeletes = valuesWithWmsLayers.filter(e => e.promise.ok === false);
    // const succeededDeletes = valuesWithWmsLayers.filter(e => e.promise.ok === true);
    // // reduce to userpresentable string
    // let deleteNotificationStr = '';
    // if (succeededDeletes.length > 0) {
    //   deleteNotificationStr += 'following wmsLayers deleted'
    // }
    // // dispatch notification
    // // is this notification evn working anywhere?
    // this.props.addNotification("wmsLayers deleted", 2000);
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
    const { total, page, isFetching } = this.state;
    const clickedCheckboxes = this.state.checkboxes.filter(e => e.checked)
      .length;

    const numberOfWmsLayers = total;

    const htmlWmsLayerTableHeader = (
      <div className={`${wmsLayerTableStyles.tableHeader}`}>
        <div className={`${wmsLayerTableStyles.tableCheckbox}`}>
          {/*Don't set id to checkbox_[i],
             otherwise the code will also try to find an accompanying uuid
            when going over the checked checkboxes and trying to find
            wmsLayers to delete these wmsLayers. */}
          <input
            type="checkbox"
            id="checkboxCheckAll"
            checked={this.state.checkAllCheckBoxes}
            onClick={e =>
              this.checkAllCheckBoxes(!this.state.checkAllCheckBoxes)}
          />
        </div>
        <div className={`${wmsLayerTableStyles.tableName}`}>
          <FormattedMessage id="wms_layers.wms_layer_name" defaultMessage="Name" />
        </div>
        <div className={`${wmsLayerTableStyles.tableDescription}`}>
          <FormattedMessage
            id="wms_layers.wms_layer_description"
            defaultMessage="Description"
          />
        </div>
      </div>
    );

    const htmlWmsLayerTableBody = (
      <div className={`${gridStyles.Row}`}>
        <div
          className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
        >

          {total === 0 && isFetching === false ? (
            <div
              className={styles.NoResults}
              style={{ minHeight: "450px" }}
            >
              <img src={wmsIcon} alt="Alarms" />
              <h5>
                <FormattedMessage
                  id="wms_layers.no_wms_layers"
                  defaultMessage="No wms layers found..."
                />
              </h5>
            </div>
          ) : isFetching === true ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "450px"
              }}
            >
              <MDSpinner />
            </div>
          ) : (
            <div>
              <Scrollbars
                autoHeight
                autoHeightMin={450}
                autoHeightMax={450}
                style={{ width: "100%" }}
              >
                {this.state.paginatedWmsLayers.map((wmsLayer, i) => {
                  return (
                    <div
                      className={`${wmsLayerTableStyles.tableBody}`}
                      key={wmsLayer.uuid}
                    >
                      <div className={`${wmsLayerTableStyles.tableCheckbox}`}>
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
                      <div
                        className={`${wmsLayerTableStyles.tableName}`}
                      >
                        <NavLink
                          to={`/data_management/wms_layers/${wmsLayer.uuid}`}
                          style={{
                            color: "#333"
                          }}
                        >
                          {wmsLayer.name}
                        </NavLink>
                      </div>
                      <div className={`${wmsLayerTableStyles.tableDescription}`}>
                        <NavLink
                          to={`/data_management/wms_layers/${wmsLayer.uuid}`}
                          style={{
                            color: "#333"
                          }}
                        >
                          {wmsLayer.description}
                        </NavLink>
                      </div>
                    </div>
                  );
                })}
              </Scrollbars>
            </div>
          )}
        </div>
      </div>
    );

    const htmlWmsLayerTableFooter = (
      <div className={`${wmsLayerTableStyles.tableFooter}`}>
        <div className={`${wmsLayerTableStyles.tableFooterLeftFiller}`} />
        <div className={`${wmsLayerTableStyles.tableInfoAndPagination}`}>
          <PaginationBar
            loadWmsLayersOnPage={page => {
              this.refreshWmsLayerFilteringAndPaginationAndUpdateState(
                this.state.wmsLayers,
                page,
                this.state.searchTerms,
                this.props.organisations.selected.uuid
              )
            }}
            page={page}
            pages={Math.ceil(total / this.state.pageSize)}
          />
          <div className={`${wmsLayerTableStyles.tableFooternumberOfWmsLayers}`}>
            <FormattedMessage
              id="wms_layers.number_of_wms_layers"
              defaultMessage={`{numberOfWmsLayers, number} {numberOfWmsLayers, plural,
            one {Wms layer}
            other {Wms layers}}`}
              values={{ numberOfWmsLayers }}
            />
          </div>
        </div>
        <div className={`${wmsLayerTableStyles.tableFooterDeleteWmsLayers}`}>
          <button
            type="button"
            className={
              clickedCheckboxes > 0
                ? `${buttonStyles.Button} ${buttonStyles.Danger}`
                : `${buttonStyles.Button} ${buttonStyles.Inactive}`
            }
            onClick={this.handleDeleteWmsLayerClick}
            style={{ maxHeight: "36px", width: "204px" }}
            disabled={clickedCheckboxes === 0 ? true : false}
          >
            <FormattedMessage
              id="wms_layers.delete_wms_layers"
              defaultMessage={` Delete {clickedCheckboxes, number} WMS`}
              values={{
                clickedCheckboxes
              }}
            />
            <Ink />
          </button>
        </div>
      </div>
    );

    return (
      <div className={wmsLayerTableStyles.tableContainer}>
        <div
          className={wmsLayerTableStyles.tableHeaderTop}
          style={{
            padding: "0 0 30px 0"
          }}
        >
          <div
            className={`${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs8}`}
          >
            <SearchBox
              handleSearch={searchTerms =>{
                this.refreshWmsLayerFilteringAndPaginationAndUpdateState(
                  this.state.wmsLayers,
                  1,
                  searchTerms,
                  this.props.organisations.selected.uuid
                )
              }}
              searchTerms={this.state.searchTerms}
              setSearchTerms={searchTerms => {
                this.refreshWmsLayerFilteringAndPaginationAndUpdateState(
                  this.state.wmsLayers,
                  1,
                  searchTerms,
                  this.props.organisations.selected.uuid
                );
              }}
              handleSearchClear={()=>{
                this.refreshWmsLayerFilteringAndPaginationAndUpdateState(
                  this.state.wmsLayers,
                  1,
                  "",
                  this.props.organisations.selected.uuid
                );
              }}
              // searching/filtering/pagination is for now done clientside so search on enter and on blur is not doing anything
              // but we still need to pass them as props to SearchBox to avoid type errors
              handleSearchEnter={() => null}
              handleSearchOnBlur={() => null}
            />
          </div>
          <div
            className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs4}`}
          >
            <button
              type="button"
              style={{ float: "right" }}
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={this.handleNewWmsLayerClick}
            >
              <FormattedMessage
                id="wms_layers.new_wms_layer"
                defaultMessage="New wms layer"
              />
              <Ink />
            </button>
          </div>
        </div>

        <div>
          {htmlWmsLayerTableHeader}
          {htmlWmsLayerTableBody}
          {htmlWmsLayerTableFooter}
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

WmsLayer = withRouter(connect(mapStateToProps, mapDispatchToProps)(WmsLayer));

export { WmsLayer };

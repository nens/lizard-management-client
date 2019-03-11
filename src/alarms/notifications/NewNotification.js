import AddButton from "../../components/AddButton";
import buttonStyles from "../../styles/Buttons.css";
import ConfigureRecipients from "./ConfigureRecipients";
import ConfigureThreshold from "./ConfigureThreshold";
import debounce from "lodash.debounce";
import formStyles from "../../styles/Forms.css";
import gridStyles from "../../styles/Grid.css";
import GroupAndTemplateSelector from "./GroupAndTemplateSelect";
import React, { Component } from "react";
import SelectBoxSimple from "../../components/SelectBoxSimple";
import SelectBoxSearch from "../../components/SelectBoxSearch";
import SelectRaster from "../../components/SelectRaster";
import SelectAsset from "../../components/SelectAsset";
import StepIndicator from "../../components/StepIndicator";
import styles from "./NewNotification.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import { withRouter } from "react-router-dom";

async function fetchContactsAndMessages(organisationId) {
  try {
    const groups = await fetch(
      `/api/v3/contactgroups/?organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => data.results);
    const messages = await fetch(
      `/api/v3/messages/?organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => data.results);
    return {
      groups,
      messages
    };
  } catch (e) {
    throw new Error(e);
  }
}

async function fetchAssets(assetName) {
  // Fetch asset from Lizard api with search endpoint
  try {
    // Set page_size to 100000, same as in Raster.js
    const assets = await fetch(
      `/api/v3/search/?q=${assetName}&page_size=100000`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        return data.results;
      });
    return assets;
  } catch (e) {
    throw new Error(e);
  }
}

async function fetchNestedAssets(assetType, assetId) {
  try {
    // Set page_size to 100000, same as in Raster.js
    const nestedAssets = await fetch(
      `/api/v3/${assetType}s/${assetId}/?page_size=100000`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        let nestedAssetsList = [];
        if (data.filters) {
          nestedAssetsList = data.filters;
        } else if (data.pumps) {
          nestedAssetsList = data.pumps;
        }
        return nestedAssetsList;
      });
    return nestedAssets;
  } catch (e) {
    throw new Error(e);
  }
}

async function fetchTimeseriesUuidsFromAsset(assetType, assetId) {
  try {
    // Set page_size to 100000, same as in Raster.js
    // get timeserie uuids from asset and his nested assets
    const uuids = await fetch(
      `/api/v3/${assetType}s/${assetId}/?page_size=100000`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => {
        // Timeseries asset
        let timeseriesUuid = [];
        if (data.timeseries) {
          timeseriesUuid = data.timeseries;
        }
        // let nestedAssetTimeseriesUuids = []; // get all timeseries of nested assets
        if (data.filters && data.filters[0] && data.filters[0].timeseries) {
          let dataFilterUuids = data.filters.map(function(dataFilter) {
            console.log(
              "NewNotification fetchTimeseriesUuidsFromAsset dataFilter",
              dataFilter
            );
            dataFilter.timeseries.forEach(function(dataFilterTimeserie) {
              timeseriesUuid.push(dataFilterTimeserie.uuid);
            });
            // dataFilter.timeseries.map(function (dataFilterTimeserie) {
            //   console.log("NewNotification fetchTimeseriesUuidsFromAsset dataFilterTimeserie.uuid", dataFilterTimeserie.uuid);
            //   return dataFilterTimeserie.uuid;
            // });
          });
          console.log("dataFilterUuids", dataFilterUuids);
          timeseriesUuid.concat(dataFilterUuids);
        } else if (data.pumps && data.pumps[0] && data.pumps[0].timeseries) {
          let dataPumpUuids = data.pumps.map(function(dataPump) {
            console.log(
              "NewNotification fetchTimeseriesUuidsFromAsset dataPump",
              dataPump
            );
            dataPump.timeseries.forEach(function(dataPumpTimeserie) {
              timeseriesUuid.push(dataPumpTimeserie.uuid);
            });
            // dataFilter.timeseries.map(function (dataFilterTimeserie) {
            //   console.log("NewNotification fetchTimeseriesUuidsFromAsset dataFilterTimeserie.uuid", dataFilterTimeserie.uuid);
            //   return dataFilterTimeserie.uuid;
            // });
          });
          // console.log("dataPumpUuids", dataPumpUuids);
          // timeseriesUuid.concat(dataPumpUuids);
          // // for (var i = 0; i < data.pumps.length; i++) {
          // //   for (var i = 0; i < data.pumps[i].timeseries.length; i++) {
          // //     let newUuid = data.pumps[i].timeseries[i].uuid;
          // //     timeseriesUuid.push(data.pumps[i].timeseries[i].uuid);
          // //   }
          // // }
        }
        return timeseriesUuid;
      });
    return uuids;
  } catch (e) {
    throw new Error(e);
  }
}

class NewNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      alarmName: "",
      availableGroups: [],
      availableMessages: [],
      comparison: ">",
      isFetching: false,
      loading: false,
      markerPosition: null,
      messages: [],
      name: null,
      numberOfRecipientGroups: 0,
      raster: null,
      rasters: [],
      showConfigureThreshold: false,
      sourceType: "",
      sourceTypes: [
        {
          display: "Raster",
          description: "Put an alarm on raster data"
        },
        {
          display: "Timeseries",
          description: "Put an alarm on timeseries data"
        }
      ],
      step: 1,
      thresholds: [],
      timeseriesAsset: "",
      timeseriesAssetType: "",
      timeseriesAssetId: "",
      timeseriesAssets: [],
      timeseriesNestedAsset: "",
      timeseriesNestedAssets: [],
      timeseriesUuid: "",
      timeseriesUuids: []
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleInputNotificationName = this.handleInputNotificationName.bind(
      this
    );
    this.hideConfigureThreshold = this.hideConfigureThreshold.bind(this);
    this.handleActivateClick = this.handleActivateClick.bind(this);
    this.handleRasterSearchInput = debounce(
      this.handleRasterSearchInput.bind(this),
      450
    );
    this.handleAssetSearchInput = debounce(
      this.handleAssetSearchInput.bind(this),
      450
    );
    this.handleSetSourceType = this.handleSetSourceType.bind(this);
    this.handleSetTimeseriesAsset = this.handleSetTimeseriesAsset.bind(this);
    this.validateTimeseriesAsset = this.validateTimeseriesAsset.bind(this);
    this.handleResetTimeseriesAsset = this.handleResetTimeseriesAsset.bind(
      this
    );
    this.handleSetTimeseriesNestedAsset = this.handleSetTimeseriesNestedAsset.bind(
      this
    );
    this.validateTimeseriesNestedAsset = this.validateTimeseriesNestedAsset.bind(
      this
    );
    this.handleResetTimeseriesNestedAsset = this.handleResetTimeseriesNestedAsset.bind(
      this
    );
    this.handleSetTimeseriesUuid = this.handleSetTimeseriesUuid.bind(this);
    this.validateTimeseriesUuid = this.validateTimeseriesUuid.bind(this);
    this.handleResetTimeseriesUuid = this.handleResetTimeseriesUuid.bind(this);
    this.handleSetRaster = this.handleSetRaster.bind(this);
    this.handleSetAsset = this.handleSetAsset.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.loadTimeseriesData = this.loadTimeseriesData.bind(this);
    this.handleAddThreshold = this.handleAddThreshold.bind(this);
    this.handleChangeComparison = this.handleChangeComparison.bind(this);
    this.handleAddGroupAndTemplate = this.handleAddGroupAndTemplate.bind(this);
    this.removeFromGroupAndTemplate = this.removeFromGroupAndTemplate.bind(
      this
    );
    this.goBackToStep = this.goBackToStep.bind(this);
  }
  componentDidMount() {
    const organisationId = this.props.selectedOrganisation.uuid;

    document.getElementById("alarmName").focus();
    document.addEventListener("keydown", this.hideConfigureThreshold, false);

    // TODO: Pass the organisation__unique_id here:
    fetchContactsAndMessages(organisationId).then(data => {
      this.setState({
        availableGroups: data.groups,
        availableMessages: data.messages
      });
    });
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.hideConfigureThreshold, false);
  }
  hideConfigureThreshold(e) {
    if (e.key === "Escape") {
      this.setState({
        showConfigureThreshold: false
      });
    }
  }
  handleEnter(event) {
    // werkt nog een beetje funky
    if (this.state.step === 3) {
      if (
        this.validateTimeseriesAsset(this.state.timeseriesAsset) &&
        event.keyCode === 13
      ) {
        // 13 is keycode 'enter' (works only when current input validates)
        const currentStep = this.state.step;
        this.setState({ step: currentStep + 1 });
      }
    } else {
      if (event.keyCode === 13) {
        // 13 is keycode 'enter' (works only when current input validates)
        const currentStep = this.state.step;
        this.setState({ step: currentStep + 1 });
      }
    }
  }
  handleInputNotificationName(e) {
    if (e.key === "Enter" && this.state.name) {
      this.setState({
        step: 2
      });
    }
  }
  handleChangeComparison(value) {
    this.setState({
      comparison: value
    });
  }
  handleActivateClick(e) {
    const { history, addNotification } = this.props;
    const organisationId = this.props.selectedOrganisation.uuid;

    const {
      alarmName,
      thresholds,
      comparison,
      messages,
      raster,
      markerPosition
    } = this.state;

    fetch("/api/v3/rasteralarms/", {
      credentials: "same-origin",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: alarmName,
        active: true,
        organisation: organisationId,
        thresholds: thresholds,
        comparison: comparison,
        messages: messages.map(message => {
          return {
            contact_group: message.groupName,
            message: message.messageName
          };
        }),
        intersection: {
          raster: raster.uuid,
          geometry: {
            type: "Point",
            coordinates: [markerPosition[1], markerPosition[0], 0.0]
          }
        }
      })
    })
      .then(response => response.json())
      .then(data => {
        addNotification(`Alarm added and activated`, 2000);
        history.push("/alarms/notifications");
      });
  }
  handleRasterSearchInput(value) {
    const { selectedOrganisation } = this.props;
    const organisationId = selectedOrganisation.uuid;

    if (value === "") {
      this.setState({
        rasters: []
      });
      return;
    }
    this.setState({
      loading: true
    });
    return fetch(
      `/api/v3/rasters/?organisation__unique_id=${organisationId}&page_size=0&name__icontains=${value}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          loading: false,
          rasters: json
        });
      });
  }
  handleAssetSearchInput(value) {
    const { raster } = this.state;

    if (value === "") {
      this.setState({
        assets: []
      });
      return;
    }
    this.setState({
      loading: true
    });

    const { west, east, north, south } = raster.spatial_bounds;

    const NUMBER_OF_RESULTS = 50;

    return fetch(
      `/api/v3/search/?page_size=${NUMBER_OF_RESULTS}&q=${value}&in_bbox=${west},${south},${east},${north}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          loading: false,
          assets: json
        });
      });
  }
  handleSetSourceType(sourceType) {
    this.setState({ sourceType });
  }
  handleSetTimeseriesAsset(assetName) {
    this.handleResetTimeseriesNestedAsset();
    this.handleResetTimeseriesUuid();
    fetchAssets(assetName).then(data => {
      let assets = [];
      let assetType = data[0].entity_name;
      let assetId = data[0].entity_id;
      for (var i = 0; i < data.length; i++) {
        assets.push(data[i].title);
      }
      // choices of SelectBoxSearch for timeserie assets
      this.setState({ timeseriesAssets: assets });
      // assetType and assetId needed for nestedAsset and uuids
      this.setState({ timeseriesAssetType: assetType });
      this.setState({ timeseriesAssetId: assetId });
    });
    // choice of SelectBoxSearch for timeserie asset
    this.setState({ timeseriesAsset: assetName });
    // this.setState({ timeseriesAssetType:  });  // nodig voor nestedAsset
    // this.setState({ timeseriesAssetId:  });  // nodig voor nestedAsset
  }
  validateTimeseriesAsset(str) {
    if (str && str.length > 1) {
      return true;
    } else {
      return false;
    }
  }
  handleResetTimeseriesAsset() {
    this.setState({
      timeseriesAssets: [],
      timeseriesAsset: ""
    });
    this.handleResetTimeseriesNestedAsset();
  }
  handleSetTimeseriesNestedAsset(timeseriesNestedAsset) {
    // fetch nested asset if any by following asset and number
    // filters as nested assets for groundwaterstations
    // add all nested assets!
    // this.setState({ timeseriesNestedAsset: "" });
    // this.setState({ timeseriesNestedAssets: [] });
    this.handleResetTimeseriesUuid();
    fetchNestedAssets(
      this.state.timeseriesAssetType,
      this.state.timeseriesAssetId
    ).then(data => {
      let nestedAssets = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].name) {
          nestedAssets.push(data[i].name);
          // } else if (data[i].code) {
          //   nestedAssets.push(data[i].code);  // of is entity_name beter?
        } else if (data[i].code) {
          nestedAssets.push(data[i].code);
        }
      }
      // choices of SelectBoxSearch for timeserie nested assets
      this.setState({ timeseriesNestedAssets: nestedAssets });
      // choice of SelectBoxSearch for timeserie nested asset
      this.setState({ timeseriesNestedAsset: timeseriesNestedAsset });
    });
    // check for all nested assets in client
    // Also set timeseries uuid
  }
  validateTimeseriesNestedAsset(str) {
    if (str && str.length > 1) {
      return true;
    } else {
      return false;
    }
  }
  handleResetTimeseriesNestedAsset() {
    this.setState({
      timeseriesNestedAssets: [],
      timeseriesNestedAsset: ""
    });
    this.handleResetTimeseriesUuid();
  }
  handleSetTimeseriesUuid(timeseriesUuid) {
    this.setState({ timeseriesUuid: timeseriesUuid });
    fetchTimeseriesUuidsFromAsset(
      this.state.timeseriesAssetType,
      this.state.timeseriesAssetId
    ).then(data => {
      let uuids = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].uuid) {
          uuids.push(data[i].uuid);
        } else {
          uuids.push(data[i]);
        }
      }
      this.setState({ timeseriesUuids: uuids });
    });
  }
  validateTimeseriesUuid(str) {
    if (str && str.length > 1) {
      return true;
    } else {
      return false;
    }
  }
  handleResetTimeseriesUuid() {
    this.setState({
      timeseriesUuids: [],
      timeseriesUuid: ""
    });
  }
  handleSetAsset(view) {
    this.setState({
      markerPosition: [view[0], view[1]]
    });
  }
  handleSetRaster(raster) {
    this.setState({
      name: raster.name,
      raster: raster
    });
  }
  handleMapClick(e) {
    this.setState({
      markerPosition: [e.latlng.lat, e.latlng.lng]
    });
  }
  loadTimeseriesData() {
    // EXAMPLE ENDPOINT URLS:

    // /api/v3/raster-aggregates/?agg=average&geom=POINT+(4.6307373046875+52.00855538139683)&rasters=730d667&srs=EPSG:4326&start=2017-09-27T00:12:01&stop=2017-09-29T03:12:01&window=3600000
    // /api/v3/raster-aggregates/?agg=curve&geom=POINT+(5.463488101959228+51.45954224745201)&rasters=fc72da4&srs=EPSG:4326&start=2008-01-01T12:00:00&stop=2012-12-31T18:00:00&window=2635200000

    // TODO: Make this timeserie call relative to now() - 1h/1d/1m
    // TODO: Show bars / lines depending on ratio or interval type

    const { markerPosition, raster } = this.state;

    let aggWindow;
    if (raster.name === "Regen") {
      // We're dealing with 'rain' layer; we need to set the aggWindow differently
      aggWindow = 60 * 60 * 1000;
    } else {
      aggWindow = 2635200000;
    }

    return fetch(
      `/api/v3/raster-aggregates/?agg=curve&geom=POINT+(${markerPosition[1]}+${markerPosition[0]})&rasters=${raster.uuid}&srs=EPSG:4326&start=2008-01-01T12:00:00&stop=2017-12-31T18:00:00&window=${aggWindow}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          timeseries: json.data
        });
      });
  }
  handleAddThreshold(value, warning_level) {
    const thresholds = this.state.thresholds.slice();
    thresholds.push({ value: value, warning_level: warning_level });
    this.setState({
      thresholds
    });
  }
  removeFromGroupAndTemplate(idx) {
    this.setState(prevState => ({
      messages: [
        ...prevState.messages.slice(0, idx),
        ...prevState.messages.slice(idx + 1)
      ]
    }));
  }
  handleAddGroupAndTemplate(object) {
    const { idx, groupName, messageName } = object;
    const messages = this.state.messages.slice();
    messages[idx] = { groupName, messageName };
    this.setState({
      messages: messages
    });
  }
  goBackToStep(toStep) {
    const { step } = this.state;
    if (toStep < step) {
      this.setState({
        step: toStep
      });
    }
  }
  formatWMSStyles(rawStyles) {
    /* 
    Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores 
    behind the screens.
    */
    return typeof rawStyles === typeof {} ? rawStyles[0][0] : rawStyles;
  }
  formatWMSLayers(rawLayerNames) {
    /* 
    Needed for compound WMS styling, i.e. 'rain' which has three seperate raster stores 
    behind the screens.
    */
    return rawLayerNames.split(",")[0];
  }
  render() {
    const position = [52.1858, 5.2677];

    const {
      alarmName,
      assets,
      availableGroups,
      availableMessages,
      comparison,
      markerPosition,
      messages,
      raster,
      rasters,
      loading,
      showConfigureRecipients,
      showConfigureThreshold,
      step,
      thresholds,
      timeseries,
      sourceType
    } = this.state;

    return (
      <div>
        <div className={gridStyles.Container}>
          <div className={`${gridStyles.Row}`}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div id="steps" style={{ margin: "20px 0 0 20px" }}>
                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="1"
                      active={step === 1}
                      handleClick={() => this.goBackToStep(1)}
                    />
                    <div
                      style={{
                        width: "calc(100% - 90px)",
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 1 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.name_of_alarm"
                          defaultMessage="Name of this alarm"
                        />
                      </h3>
                      {step === 1 ? (
                        <div>
                          <p className="text-muted">
                            <FormattedMessage
                              id="notifications_app.name_will_be_used_in_alerts"
                              defaultMessage="The name of the raster will be used in e-mail and SMS alerts"
                            />
                          </p>
                          <div className={formStyles.FormGroup}>
                            <input
                              id="alarmName"
                              tabIndex="-2"
                              type="text"
                              autoComplete="false"
                              className={formStyles.FormControl}
                              placeholder="Name of this alarm"
                              onChange={e =>
                                this.setState({
                                  alarmName: e.target.value
                                })}
                              value={alarmName}
                            />
                            {alarmName && alarmName.length > 1 ? (
                              <button
                                type="button"
                                className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                                style={{ marginTop: 10 }}
                                onClick={() => {
                                  this.setState({
                                    step: 2
                                  });
                                }}
                              >
                                <FormattedMessage
                                  id="notifications_app.next_step"
                                  defaultMessage="Next step"
                                />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="2"
                      active={step === 2}
                      handleClick={() => this.goBackToStep(2)}
                    />
                    <div
                      style={{
                        width: "calc(100% - 90px)",
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 2 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.source_type_selection"
                          defaultMessage="Source type selection"
                        />
                      </h3>
                      {step === 2 ? (
                        <div>
                          <p className="text-muted">
                            <FormattedMessage
                              id="notifications_app.whci_data_type"
                              defaultMessage="Which data type is the alarm for?"
                            />
                          </p>
                          <div className={formStyles.FormGroup}>
                            <SelectBoxSimple
                              choices={this.state.sourceTypes}
                              choice={this.state.sourceType.display}
                              isFetching={undefined}
                              transformChoiceToDisplayValue={e =>
                                (e && e.display) || ""}
                              updateModelValue={this.handleSetSourceType}
                              onKeyUp={e => this.handleEnter(e)}
                              inputId={
                                "notifications_app.source_type_selection" +
                                "_input"
                              }
                              placeholder={"Click to select data source type"}
                              transformChoiceToDescription={e =>
                                (e && e.description) || ""}
                              // transformChoiceToInfo={e => (e && e.info) || ""}
                              noneValue={undefined}
                            />
                            {this.state.sourceType ? (
                              <button
                                type="button"
                                className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                                style={{ marginTop: 10 }}
                                onClick={() => {
                                  this.setState({
                                    step: 3
                                  });
                                }}
                              >
                                <FormattedMessage
                                  id="notifications_app.next_step"
                                  defaultMessage="Next step"
                                />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="3"
                      active={step === 3}
                      handleClick={() => this.goBackToStep(3)}
                    />
                    <div
                      style={{
                        width: "calc(100% - 90px)",
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 3 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.timeseries_selection"
                          defaultMessage="Timeseries selection"
                        />
                      </h3>
                      {step === 3 ? (
                        <div>
                          <p className="text-muted">
                            <FormattedMessage
                              id="notifications_app.select_timeserie_via_asset"
                              defaultMessage="Select timeserie via asset."
                            />
                          </p>
                          <div className={formStyles.FormGroup}>
                            <SelectBoxSearch
                              choices={this.state.timeseriesAssets}
                              choice={this.state.timeseriesAsset}
                              transformChoiceToDisplayValue={e => e || ""}
                              isFetching={false}
                              updateModelValue={this.handleSetTimeseriesAsset}
                              onKeyUp={e => {
                                fetchAssets(this.state.timeseriesAssets);
                                this.handleEnter(e); /* maken*/
                              }}
                              inputId={
                                "notifications_app.select_timeserie_via_asset" +
                                "_input"
                              }
                              placeholder={"Click to select timeseries asset"}
                              validate={this.validateTimeseriesAsset}
                              resetModelValue={this.handleResetTimeseriesAsset}
                              readonly={false}
                              noneValue={undefined}
                            />{" "}
                            <br />
                            <SelectBoxSearch
                              choices={this.state.timeseriesNestedAssets}
                              choice={this.state.timeseriesNestedAsset}
                              transformChoiceToDisplayValue={e => e || ""}
                              isFetching={false}
                              updateModelValue={
                                this.handleSetTimeseriesNestedAsset
                              }
                              onKeyUp={e => {
                                fetchNestedAssets(
                                  this.state.timeseriesAssetType,
                                  this.state.timeseriesAssetId
                                );
                                this.handleEnter(e); /* maken*/
                              }}
                              inputId={
                                "notifications_app.select_timeserie_via_nested_asset" +
                                "_input"
                              }
                              placeholder={
                                "Click to select timeseries nested asset"
                              }
                              validate={this.validateTimeseriesNestedAsset}
                              resetModelValue={
                                this.handleResetTimeseriesNestedAsset
                              }
                              readonly={false}
                              noneValue={undefined}
                            />{" "}
                            <br />
                            <SelectBoxSearch
                              choices={this.state.timeseriesUuids}
                              choice={this.state.timeseriesUuid}
                              transformChoiceToDisplayValue={e => e || ""}
                              isFetching={false}
                              updateModelValue={this.handleSetTimeseriesUuid}
                              onKeyUp={e => {
                                fetchTimeseriesUuidsFromAsset(
                                  this.state.timeseriesAssetType,
                                  this.state.timeseriesAssetId
                                );
                                this.handleEnter(e); /* maken*/
                              }}
                              inputId={
                                "notifications_app.select_timeserie_via_uuid" +
                                "_input"
                              }
                              placeholder={
                                "Click to select timeseries uuid asset"
                              }
                              validate={this.validateTimeseriesUuid}
                              resetModelValue={this.handleResetTimeseriesUuid}
                              readonly={false}
                              noneValue={undefined}
                            />
                            {this.state.timeseriesUuid ? (
                              <button
                                type="button"
                                className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                                style={{ marginTop: 10 }}
                                onClick={() => {
                                  this.setState({
                                    step: 4
                                  });
                                }}
                              >
                                <FormattedMessage
                                  id="notifications_app.next_step"
                                  defaultMessage="Next step"
                                />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="4"
                      active={step === 4}
                      handleClick={() => this.goBackToStep(4)}
                    />
                    <div
                      style={{
                        width: "calc(100% - 90px)",
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 4 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.raster_selection"
                          defaultMessage="Raster selection"
                        />
                      </h3>
                      {step === 4 ? (
                        <div>
                          <p className="text-muted">
                            <FormattedMessage
                              id="notifications_app.which_temporal_raster_to_use"
                              defaultMessage="Which temporal raster do you want to use?"
                            />
                          </p>
                          <div className={formStyles.FormGroup}>
                            <SelectRaster
                              placeholderText="Type to search"
                              results={rasters}
                              loading={loading}
                              onInput={this.handleRasterSearchInput}
                              setRaster={this.handleSetRaster}
                            />
                            {this.state.name ? (
                              <button
                                type="button"
                                className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                                style={{ marginTop: 10 }}
                                onClick={() => {
                                  if (raster) {
                                    this.setState({
                                      step: 5
                                    });
                                  }
                                }}
                              >
                                <FormattedMessage
                                  id="notifications_app.next_step"
                                  defaultMessage="Next step"
                                />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="5"
                      active={step === 5}
                      handleClick={() => this.goBackToStep(5)}
                    />
                    <div
                      style={{
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 5 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.point_on_map"
                          defaultMessage="Point-on-map"
                        />
                      </h3>
                      {step === 5 ? (
                        <div>
                          <p className="text-muted">
                            <FormattedMessage
                              id="notifications_app.set_the_location"
                              defaultMessage="Set the location of this alarm by placing a marker (tap/click on the map)"
                            />
                          </p>

                          <SelectAsset
                            placeholderText="Type to search"
                            results={assets}
                            loading={loading}
                            onInput={this.handleAssetSearchInput}
                            setAsset={this.handleSetAsset}
                          />

                          {raster.spatial_bounds ? (
                            <Map
                              onClick={this.handleMapClick}
                              bounds={[
                                [
                                  raster.spatial_bounds.south,
                                  raster.spatial_bounds.west
                                ],
                                [
                                  raster.spatial_bounds.north,
                                  raster.spatial_bounds.east
                                ]
                              ]}
                              className={styles.MapStyle}
                            >
                              <TileLayer
                                // url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png"
                                url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                              />
                              <WMSTileLayer
                                url={`/api/v3/wms/`}
                                styles={this.formatWMSStyles(
                                  raster.options.styles
                                )}
                                layers={this.formatWMSLayers(
                                  raster.wms_info.layer
                                )}
                                opacity={0.9}
                              />
                              <TileLayer
                                url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.0a5c8e74/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                              />
                              {markerPosition ? (
                                <Marker position={markerPosition} />
                              ) : null}
                            </Map>
                          ) : (
                            <Map
                              onClick={this.handleMapClick}
                              center={position}
                              zoom={8}
                              className={styles.MapStyle}
                            >
                              <TileLayer
                                url="https://b.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png"
                                attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                              />
                              {markerPosition ? (
                                <Marker position={markerPosition} />
                              ) : null}
                            </Map>
                          )}

                          <button
                            type="button"
                            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                            style={{ marginTop: 10 }}
                            onClick={() => {
                              if (markerPosition) {
                                this.loadTimeseriesData();
                                this.setState({
                                  step: 6
                                });
                              }
                            }}
                          >
                            <FormattedMessage
                              id="notifications_app.next_step"
                              defaultMessage="Next step"
                            />
                          </button>
                          <button
                            type="button"
                            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                            style={{ marginLeft: 15, marginTop: 10 }}
                            onClick={() =>
                              this.setState({
                                step: 6
                              })}
                          >
                            <FormattedMessage
                              id="notifications_app.back"
                              defaultMessage="Back"
                            />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="6"
                      active={step === 6}
                      handleClick={() => this.goBackToStep(6)}
                    />
                    <div
                      style={{
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 6 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.newnotification_thresholds"
                          defaultMessage="Thresholds"
                        />
                      </h3>
                      {step === 6 ? (
                        <div>
                          <p className="text-muted">
                            <FormattedMessage
                              id="notifications_app.this_alarm_will_be_triggered"
                              defaultMessage="This alarm will be triggered whenever a threshold is exceeded."
                            />
                          </p>
                          <div className={formStyles.FormGroup}>
                            <label htmlFor="comparison">
                              <FormattedMessage
                                id="notifications_app.comparison"
                                defaultMessage="Comparison"
                              />
                            </label>
                            <select
                              onChange={e =>
                                this.handleChangeComparison(e.target.value)}
                              value={this.state.comparison}
                              className={`${formStyles.FormControl} ${formStyles.Large}`}
                              id="comparison"
                            >
                              <option value=">">&gt;</option>
                              <option value="<">&lt;</option>
                            </select>
                            <small className="form-text text-muted">
                              <FormattedMessage
                                id="notifications_app.comparison_for_all_alarm_thresholds"
                                defaultMessage="Comparison for all alarm thresholds, either < or >"
                              />
                            </small>
                          </div>

                          <div className={styles.Thresholds}>
                            {thresholds.map((threshold, i) => {
                              return (
                                <div key={i} className={styles.Threshold}>
                                  <i
                                    style={{
                                      position: "relative",
                                      top: 3,
                                      left: 2
                                    }}
                                    className="material-icons"
                                  >
                                    access_time
                                  </i>&nbsp;
                                  <span
                                    style={{
                                      marginLeft: 10,
                                      top: -1,
                                      position: "relative"
                                    }}
                                  >
                                    <FormattedMessage
                                      id="notifications_app.alarm_when_value"
                                      defaultMessage="Alarm when value"
                                    />{" "}
                                    {comparison} {threshold.value}
                                  </span>
                                  <button
                                    type="button"
                                    className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link} ${gridStyles.FloatRight}`}
                                    onClick={() =>
                                      console.error(
                                        "Remove still has to be implemented..."
                                      )}
                                  >
                                    <FormattedMessage
                                      id="notifications_app.newnotification_remove"
                                      defaultMessage="Remove"
                                    />
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          <AddButton
                            handleClick={() =>
                              this.setState({ showConfigureThreshold: true })}
                            title="Add threshold"
                          />
                          <button
                            type="button"
                            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                            style={{ marginTop: 10 }}
                            onClick={() => {
                              this.setState({
                                step: 7
                              });
                            }}
                          >
                            <FormattedMessage
                              id="notifications_app.next_step"
                              defaultMessage="Next step"
                            />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="media">
                  <StepIndicator indicator="7" active={step === 7} />
                  <div
                    style={{
                      marginLeft: 90
                    }}
                  >
                    <h3 className={`mt-0 ${step !== 7 ? "text-muted" : null}`}>
                      <FormattedMessage
                        id="notifications_app.recipients"
                        defaultMessage="Recipients"
                      />
                    </h3>
                    {step === 7 ? (
                      <div>
                        <p className="text-muted">
                          <FormattedMessage
                            id="notifications_app.when_an_alarm_is_triggered"
                            defaultMessage="When an alarm is triggered, these groups of recipients will be notified."
                          />
                        </p>
                        <div>
                          {messages.map((message, i) => {
                            return (
                              <GroupAndTemplateSelector
                                key={i}
                                idx={i}
                                messageName={message.messageName}
                                groupName={message.groupName}
                                availableGroups={availableGroups}
                                availableMessages={availableMessages}
                                addGroupAndTemplate={
                                  this.handleAddGroupAndTemplate
                                }
                                removeFromGroupAndTemplate={
                                  this.removeFromGroupAndTemplate
                                }
                              />
                            );
                          })}
                        </div>
                        <AddButton
                          handleClick={() => {
                            const messages = this.state.messages.slice();
                            messages.push({
                              messageName: null,
                              groupName: null
                            });
                            this.setState({
                              messages
                            });
                          }}
                          title="Add recipients"
                        />
                        <button
                          type="button"
                          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                          style={{ marginTop: 10 }}
                          onClick={this.handleActivateClick}
                        >
                          <FormattedMessage
                            id="notifications_app.activate"
                            defaultMessage="Activate"
                          />
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showConfigureThreshold ? (
          <ConfigureThreshold
            // TODO: Pass value and warning_level to reinstantiate this component on click??
            handleAddThreshold={this.handleAddThreshold}
            raster={raster}
            timeseries={timeseries}
            handleClose={() => this.setState({ showConfigureThreshold: false })}
          />
        ) : null}
        {showConfigureRecipients ? (
          <ConfigureRecipients
            handleClose={() =>
              this.setState({ showConfigureRecipients: false })}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedOrganisation: state.organisations.selected
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

const App = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewNotification)
);

export { App };

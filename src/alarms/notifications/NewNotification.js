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
import ThresholdChart from "./ThresholdChart";
import styles from "./NewNotification.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import { withRouter } from "react-router-dom";
import { postNewNotification } from "../../utils/postNewNotification.js";

async function fetchContactsAndMessages(organisationId) {
  try {
    const groups = await fetch(
      `/api/v4/contactgroups/?organisation__unique_id=${organisationId}`,
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => data.results);
    const messages = await fetch(
      `/api/v4/messages/?organisation__unique_id=${organisationId}`,
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

class NewNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      alarmName: "",
      availableGroups: [],
      availableMessages: [],
      comparison: null,
      loading: false,
      markerPosition: null,
      messages: [],
      name: null,
      numberOfRecipientGroups: 0,
      raster: null,
      rasters: [],
      showConfigureThreshold: false,
      step: 1,
      thresholds: [],
      thresholdValue: "",
      thresholdName: "",
      snooze_sign_on: 1,
      snooze_sign_off: 1,

      sourceType: {
        display: "Rasters",
        description: "Put an alarm on raster data"
      },

      foundTimeseriesAssetsSearchEndpoint: [],
      selectedTimeseriesAssetFromSearchEndpoint: {},
      selectedTimeseriesAssetFromAssetEndpoint: {},

      selectedTimeseriesNestedAsset: {},

      selectedTimeseries: {} // selectedTimeseries.uuid is the timeseries uuid
    };
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
    this.fetchAssetsFromSearchEndpoint = this.fetchAssetsFromSearchEndpoint.bind(
      this
    );
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
    this.handleSetTimeseries = this.handleSetTimeseries.bind(this);
    this.validateTimeseries = this.validateTimeseries.bind(this);
    this.handleResetTimeseries = this.handleResetTimeseries.bind(this);
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
    this.handleChangeThresholdValue = this.handleChangeThresholdValue.bind(this);
    this.handleChangeThresholdName = this.handleChangeThresholdName.bind(this);
    this.handleSnoozeSignOn = this.handleSnoozeSignOn.bind(this);
    this.handleSnoozeSignOff = this.handleSnoozeSignOff.bind(this);
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

    postNewNotification(this.state, organisationId).then(data => {
      addNotification(`Alarm added and activated`, 2000);
      history.push("/alarms/notifications");
    });
  }
  handleRasterSearchInput(value) {
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
      `/api/v3/rasters/?page_size=0&name__icontains=${value}`,  // show all raster the user has access to
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
  async fetchAssetsFromSearchEndpoint(assetName) {
    // Fetch assets from Lizard api with search endpoint.
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
  async handleSetTimeseriesAsset(assetObj) {
    this.handleResetTimeseriesAsset();
    this.setState({
      selectedTimeseriesAssetFromSearchEndpoint: assetObj
    });
    // do not fetch asset obj if selected asset is not validated
    if (!this.validateTimeseriesAsset(assetObj)) {
      return;
    }
    try {
      // Set page_size to 100000, same as in Raster.js
      const asset = await fetch(
        `/api/v3/${assetObj.entity_name}s/${assetObj.entity_id}/?page_size=100000`,
        {
          credentials: "same-origin"
        }
      )
        .then(response => response.json())
        .then(data => {
          return data;
        });
      this.setState({
        selectedTimeseriesAssetFromAssetEndpoint: asset
      });
    } catch (e) {
      throw new Error(e);
    }
  }
  validateTimeseriesAsset(obj) {
    return obj.title && obj.entity_id && obj.entity_name;
  }
  handleResetTimeseriesAsset() {
    this.setState({
      foundTimeseriesAssetsSearchEndpoint: [],
      selectedTimeseriesAssetFromSearchEndpoint: {},
      selectedTimeseriesAssetFromAssetEndpoint: {}
    });
    this.handleResetTimeseriesNestedAsset();
    this.handleResetTimeseries();
  }
  async handleSetTimeseriesNestedAsset(nestedAssetObj) {
    this.setState({
      selectedTimeseriesNestedAsset: nestedAssetObj
    });
  }
  validateTimeseriesNestedAsset(obj) {
    return obj.code || obj.name;
  }
  handleResetTimeseriesNestedAsset() {
    this.setState({
      selectedTimeseriesNestedAsset: {}
    });
    this.handleResetTimeseries();
  }
  async handleSetTimeseries(timeseriesObj) {
    this.setState({
      selectedTimeseries: timeseriesObj
    });
  }
  getAllTimeseriesFromTimeseriesAsset(assetObj, nestedAssetObj) {
    // Show timeseries of nested asset if a nested asset is selected.
    if (nestedAssetObj && nestedAssetObj.timeseries) {
      return nestedAssetObj.timeseries;
      // Show timeseries of only the asset and not also the nested assets if
      // an asset but no nested asset is selected.
    } else if (assetObj && assetObj.timeseries) {
      return assetObj.timeseries;
    } else {
      return [];
    }
  }
  validateTimeseries(obj) {
    return obj && obj.uuid && obj.uuid.length > 0;
  }
  handleResetTimeseries() {
    this.setState({
      selectedTimeseries: {}
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
      thresholds,
      thresholdValue: "",
      thresholdName: ""
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
  handleChangeThresholdValue(e) {
    this.setState({
      thresholdValue: parseFloat(e.target.value)
    });
  }
  handleChangeThresholdName(e) {
    this.setState({
      thresholdName: e.target.value
    });
  }
  handleSnoozeSignOn(e) {
    this.setState({
      snooze_sign_on: parseFloat(e.target.value)
    });
  }
  handleSnoozeSignOff(e) {
    this.setState({
      snooze_sign_off: parseFloat(e.target.value)
    });
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
      thresholdValue,
      thresholdName,
      snooze_sign_on,
      snooze_sign_off,
      timeseries,
      sourceType
    } = this.state;

    // console.log('value', thresholdValue)
    // console.log('name', thresholdName)
    // console.log('thresholds', thresholds)
    // console.log('snooze', snooze_sign_on, snooze_sign_off)
    // console.log('messages', messages)
    // console.log('available messages', availableMessages)
    // console.log('available group', availableGroups)

    //Format message for placeholder in the input form for translation
    const placeholderTimeseriesSelectionViaAsset = this.props.intl.formatMessage({ id: "placeholder_timeseries_selection_via_asset" });
    const placeholderTimeseriesSelectionViaNestedAsset = this.props.intl.formatMessage({ id: "placeholder_timeseries_selection_via_nested_asset" });
    const placeholderTimeseriesSelection = this.props.intl.formatMessage({ id: "placeholder_timeseries_selection" });

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
                              id="notifications_app.which_data_type"
                              defaultMessage="Which data type is the alarm for?"
                            />
                          </p>
                          <div className={formStyles.FormGroup}>
                            <SelectBoxSimple
                              choices={[
                                {
                                  display: "Rasters",
                                  description: "Put an alarm on raster data"
                                },
                                {
                                  display: "Timeseries",
                                  description: "Put an alarm on timeseries data"
                                }
                              ]}
                              choice={sourceType.display}
                              isFetching={false}
                              transformChoiceToDisplayValue={e =>
                                (e && e.display) || ""}
                              updateModelValue={this.handleSetSourceType}
                              onKeyUp={null}
                              inputId={
                                "notifications_app.source_type_selection" +
                                "_input"
                              }
                              placeholder={"Click to select data source type"}
                              transformChoiceToDescription={e =>
                                (e && e.description) || ""}
                              noneValue={undefined}
                            />
                            {sourceType.display === "Rasters" ||
                            sourceType.display === "Timeseries" ? (
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

                {sourceType.display === "Rasters" ? (
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
                            id="notifications_app.raster_selection"
                            defaultMessage="Raster selection"
                          />
                        </h3>
                        {step === 3 ? (
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

                              <br />

                              <p className="text-muted">
                                <FormattedMessage
                                  id="notifications_app.set_the_location"
                                  defaultMessage="Set the location of this alarm by placing a marker (tap/click on the map)"
                                />
                              </p>

                              <SelectAsset
                                placeholderText={
                                  raster
                                    ? "Type to search"
                                    : "Please first select raster"
                                }
                                results={assets}
                                loading={loading}
                                onInput={this.handleAssetSearchInput}
                                setAsset={this.handleSetAsset}
                                readOnly={!raster ? true : false}
                              />

                              {raster && raster.spatial_bounds ? (
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

                              {this.state.name ? (
                                <button
                                  type="button"
                                  className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                                  style={{ marginTop: 10 }}
                                  onClick={() => {
                                    if (raster) {
                                      this.setState({
                                        step: 4
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
                ) : sourceType.display === "Timeseries" ? (
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
                                choices={
                                  this.state.foundTimeseriesAssetsSearchEndpoint
                                }
                                choice={
                                  this.state
                                    .selectedTimeseriesAssetFromSearchEndpoint
                                }
                                transformChoiceToDisplayValue={e =>
                                  (e && e.title) || ""}
                                isFetching={false}
                                updateModelValue={this.handleSetTimeseriesAsset}
                                onKeyUp={e => {
                                  this.fetchAssetsFromSearchEndpoint(
                                    e.target.value
                                  ).then(data => {
                                    this.setState({
                                      foundTimeseriesAssetsSearchEndpoint: data
                                    });
                                  });
                                }}
                                inputId={
                                  "notifications_app.select_timeserie_via_asset" +
                                  "_input"
                                }
                                placeholder={placeholderTimeseriesSelectionViaAsset}
                                validate={this.validateTimeseriesAsset}
                                resetModelValue={
                                  this.handleResetTimeseriesAsset
                                }
                                readonly={false}
                                noneValue={undefined}
                              />{" "}
                              <br />
                              <SelectBoxSearch
                                choices={
                                  this.state
                                    .selectedTimeseriesAssetFromAssetEndpoint
                                    .pumps ||
                                  this.state
                                    .selectedTimeseriesAssetFromAssetEndpoint
                                    .filters ||
                                  []
                                }
                                choice={
                                  this.state.selectedTimeseriesNestedAsset
                                }
                                transformChoiceToDisplayValue={e =>
                                  (e && e.code) || (e && e.name) || ""}
                                isFetching={false}
                                updateModelValue={
                                  this.handleSetTimeseriesNestedAsset
                                }
                                onKeyUp={e => {}}
                                inputId={
                                  "notifications_app.select_timeserie_via_nested_asset" +
                                  "_input"
                                }
                                placeholder={placeholderTimeseriesSelectionViaNestedAsset}
                                validate={this.validateTimeseriesNestedAsset}
                                resetModelValue={
                                  this.handleResetTimeseriesNestedAsset
                                }
                                readonly={false}
                                noneValue={undefined}
                              />{" "}
                              <br />
                              <SelectBoxSearch
                                choices={this.getAllTimeseriesFromTimeseriesAsset(
                                  this.state
                                    .selectedTimeseriesAssetFromAssetEndpoint,
                                  this.state.selectedTimeseriesNestedAsset
                                )}
                                choice={this.state.selectedTimeseries}
                                transformChoiceToDisplayValue={e => {
                                  if (e) {
                                    if (e.name && e.uuid) {
                                      return `name: ${e.name} - uuid: ${e.uuid}`;
                                    } else if (e.name) {
                                      return `name: ${e.name}`;
                                    } else if (e.uuid) {
                                      return `uuid: ${e.uuid}`;
                                    } else {
                                      return "";
                                    }
                                  } else {
                                    return "";
                                  }
                                }}
                                isFetching={false}
                                updateModelValue={e => {
                                  if (typeof e === "string") {
                                    // e is a string typed in by user
                                    this.handleSetTimeseries({ uuid: e });
                                  } else {
                                    // e is a timeseries object coming from a selected option from the API
                                    this.handleSetTimeseries(e);
                                  }
                                }}
                                onKeyUp={e => {}}
                                inputId={
                                  "notifications_app.select_timeserie" +
                                  "_input"
                                }
                                placeholder={placeholderTimeseriesSelection}
                                validate={this.validateTimeseries}
                                resetModelValue={this.handleResetTimeseries}
                                readonly={false}
                                noneValue={undefined}
                              />{" "}
                              <br />
                              {this.validateTimeseries(
                                this.state.selectedTimeseries
                              ) ? (
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
                ) : null}

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="4"
                      active={step === 4}
                      handleClick={() => this.goBackToStep(4)}
                    />
                    <div
                      style={{
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 4 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.newnotification_thresholds"
                          defaultMessage="Alarm thresholds"
                        />
                      </h3>
                      {step === 4 ? (
                        <div>
                          <div className={styles.AddThreshold}>
                            <label htmlFor="comparison" className={styles.Comparision}>
                              <FormattedMessage
                                id="notifications_app.comparison"
                                defaultMessage="Comparison"
                              />
                            </label>
                            <div className={styles.ThresholdInput}>
                              <div className={styles.ThresholdValueInput}>
                                <button
                                  className={
                                    this.state.comparison === ">" ?
                                      `${styles.SelectedButton}`
                                      :
                                      `${styles.SelectedButton} ${styles.UnselectedButton}`
                                  }
                                  onClick={() => this.setState({ comparison: ">" })}
                                >
                                  higher than &gt;
                                </button>
                                <label htmlFor="value">
                                  Value
                                </label>
                                <div className={styles.ThresholdValues}>
                                  {thresholds.map((threshold, i) => <div key={i}>{comparison} {threshold.value}</div>)}
                                </div>
                                <input
                                  type="number"
                                  id="value"
                                  value={thresholdValue}
                                  className={formStyles.FormControlSmall}
                                  onChange={this.handleChangeThresholdValue}
                                />
                              </div>
                              <div className={styles.ThresholdNameInput}>
                                <button
                                  className={
                                    this.state.comparison === "<" ?
                                      `${styles.SelectedButton}`
                                      :
                                      `${styles.SelectedButton} ${styles.UnselectedButton}`
                                  }
                                  onClick={() => this.setState({ comparison: "<" })}
                                >
                                  lower than &lt;
                                </button>
                                <label htmlFor="warning_label">
                                  Name
                                </label>
                                <div className={styles.ThresholdNames}>
                                  {thresholds.map((threshold, i) => (
                                    <div key={i}>
                                      <span>{threshold.warning_level}</span>
                                      <span 
                                        className={styles.ThresholdDelete}
                                        onClick={() => thresholds.splice(i, 1)}
                                      >
                                        &#10007;
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <input
                                  type="text"
                                  id="warning_label"
                                  value={thresholdName}
                                  className={formStyles.FormControlSmall}
                                  onChange={this.handleChangeThresholdName}
                                />
                              </div>
                            </div>
                            <button
                              className={
                                comparison && thresholdValue && thresholdName ?
                                  `${styles.AddThresholdButton}`
                                  :
                                  `${styles.AddThresholdButton} ${styles.InactiveAddThresholdButton}`
                              }
                              onClick={() => {
                                return comparison && thresholdValue && thresholdName ? this.handleAddThreshold(
                                  thresholdValue, thresholdName
                                ) : null
                              }}
                            >
                              {this.state.comparison ? "ADD THRESHOLD" : "NEW THRESHOLD"}
                            </button>
                            {raster && timeseries ? (
                              <ThresholdChart
                                timeseries={timeseries}
                                value={thresholdValue}
                                parameter={
                                  raster.observation_type
                                    ? raster.observation_type.parameter
                                    : null
                                }
                                unit={
                                  raster.observation_type
                                    ? raster.observation_type.unit
                                    : null
                                }
                                code={
                                  raster.observation_type
                                    ? raster.observation_type.code
                                    : null
                                }
                              />
                            ) : null}
                          </div>
                          <button
                            type="button"
                            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                            style={{ 
                              marginTop: 10,
                              display: thresholds.length > 0 ? null : "none"
                            }}
                            onClick={() => {
                              this.setState({
                                step: 5
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
                    <h3 className={`mt-0 ${step !== 5 ? "text-muted" : null}`}>
                      <FormattedMessage
                        id="notifications_app.snoozing"
                        defaultMessage="Snoozing"
                      />
                    </h3>
                    {step === 5 ? (
                      <div className={styles.Snoozing}>
                        <div>
                          <span>Snooze alarm after</span>
                          <input
                            type="number"
                            min="1"
                            id="snooze_sign_on"
                            value={snooze_sign_on}
                            className={formStyles.FormControlSmall}
                            onChange={this.handleSnoozeSignOn}
                          />
                          <span>{snooze_sign_on > 1 ? "times" : "time"}</span>
                        </div>
                        <div>
                          <span>Snooze "No further impact" after</span>
                          <input
                            type="number"
                            min="1"
                            id="snooze_sign_off"
                            value={snooze_sign_off}
                            className={formStyles.FormControlSmall}
                            onChange={this.handleSnoozeSignOff}
                          />
                          <span>{snooze_sign_off > 1 ? "times" : "time"}</span>
                        </div>
                        <button
                          type="button"
                          className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                          style={{ marginTop: 10 }}
                          onClick={() => {
                            this.setState({
                              step: 6
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

                <div className="media">
                  <StepIndicator indicator="6" active={step === 6} />
                  <div
                    style={{
                      marginLeft: 90
                    }}
                  >
                    <h3 className={`mt-0 ${step !== 6 ? "text-muted" : null}`}>
                      <FormattedMessage
                        id="notifications_app.recipients"
                        defaultMessage="Recipients"
                      />
                    </h3>
                    {step === 6 ? (
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
                                key={message.messageName + i}
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
                          className={
                            messages[0] && messages[0].messageName && messages[0].groupName ?
                              `${buttonStyles.Button} ${buttonStyles.Success}`
                              :
                              `${buttonStyles.Button} ${buttonStyles.Inactive}`
                          }
                          style={{ marginTop: 10 }}
                          onClick={
                            messages[0] && messages[0].messageName && messages[0].groupName ? this.handleActivateClick : null
                          }
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
  connect(mapStateToProps, mapDispatchToProps)(injectIntl(NewNotification))
);

export { App };

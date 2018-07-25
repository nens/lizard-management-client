import AddButton from "../../components/AddButton";
import buttonStyles from "../../styles/Buttons.css";
import ConfigureRecipients from "./ConfigureRecipients";
import ConfigureThreshold from "./ConfigureThreshold";
import debounce from "lodash.debounce";
import formStyles from "../../styles/Forms.css";
import gridStyles from "../../styles/Grid.css";
import GroupAndTemplateSelector from "./GroupAndTemplateSelect";
import React, { Component } from "react";
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

class NewNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      alarmName: "",
      availableGroups: [],
      availableMessages: [],
      comparison: ">",
      loading: false,
      markerPosition: null,
      messages: [],
      name: null,
      numberOfRecipientGroups: 0,
      raster: null,
      rasters: [],
      showConfigureThreshold: false,
      step: 1,
      thresholds: []
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
    const organisationId = this.props.selectedOrganisation.unique_id;

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
  componentDidCatch() {
    console.log("componentDidCatch()");
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
    const organisationId = this.props.selectedOrganisation.unique_id;

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
    const organisationId = selectedOrganisation.unique_id;

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
      timeseries
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
                          id="notifications_app.raster_selection"
                          defaultMessage="Raster selection"
                        />
                      </h3>
                      {step === 2 ? (
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
                                      step: 3
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
                      indicator="3"
                      active={step === 3}
                      handleClick={() => this.goBackToStep(3)}
                    />
                    <div
                      style={{
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${step !== 3 ? "text-muted" : null}`}
                      >
                        <FormattedMessage
                          id="notifications_app.point_on_map"
                          defaultMessage="Point-on-map"
                        />
                      </h3>
                      {step === 3 ? (
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
                          <button
                            type="button"
                            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                            style={{ marginLeft: 15, marginTop: 10 }}
                            onClick={() =>
                              this.setState({
                                step: 2
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
                          defaultMessage="Thresholds"
                        />
                      </h3>
                      {step === 4 ? (
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
                                      console.log(
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
                  <StepIndicator indicator="5" active={step === 5} />
                  <div
                    style={{
                      marginLeft: 90
                    }}
                  >
                    <h3 className={`mt-0 ${step !== 5 ? "text-muted" : null}`}>
                      <FormattedMessage
                        id="notifications_app.recipients"
                        defaultMessage="Recipients"
                      />
                    </h3>
                    {step === 5 ? (
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

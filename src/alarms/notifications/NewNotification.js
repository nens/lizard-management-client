import React, { Component } from "react";
import debounce from "lodash.debounce";
import SelectRaster from "../../components/SelectRaster";
import { connect } from "react-redux";
import { createAlarm } from "../../actions";
import { withRouter } from "react-router-dom";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import styles from "./NewNotification.css";
import StepIndicator from "../../components/StepIndicator";
import GroupAndTemplateSelector from "./GroupAndTemplateSelect";
import AddButton from "../../components/AddButton";
import ConfigureThreshold from "./ConfigureThreshold";
import ConfigureRecipients from "./ConfigureRecipients";

async function fetchContactsAndMessages() {
  try {
    const groups = await fetch("/api/v3/contactgroups/")
      .then(response => response.json())
      .then(data => data.results);
    const messages = await fetch("/api/v3/messages/")
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
    this.handleSetRaster = this.handleSetRaster.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.loadTimeseriesData = this.loadTimeseriesData.bind(this);
    this.handleAddThreshold = this.handleAddThreshold.bind(this);
    this.handleChangeComparison = this.handleChangeComparison.bind(this);
    this.handleAddGroupAndTemplate = this.handleAddGroupAndTemplate.bind(this);
    this.removeFromGroupAndTemplate = this.removeFromGroupAndTemplate.bind(
      this
    );
  }
  componentDidMount() {
    document.getElementById("rasterName").focus();
    document.addEventListener("keydown", this.hideConfigureThreshold, false);
    fetchContactsAndMessages().then(data => {
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
    const { doCreateAlarm, currentOrganisation } = this.props;
    const {
      name,
      thresholds,
      comparison,
      messages,
      raster,
      markerPosition
    } = this.state;

    doCreateAlarm({
      name: name,
      active: true,
      organisation: currentOrganisation.unique_id,
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
    });
    this.props.history.push("/alarms/notifications");
  }
  handleRasterSearchInput(value) {
    const { currentOrganisation } = this.props;
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
      `/api/v3/rasters/?organisation__unique_id=${currentOrganisation.unique_id}&page_size=0&name__icontains=${value}`
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          loading: false,
          rasters: json
        });
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
    return fetch(
      `/api/v3/raster-aggregates/?agg=curve&geom=POINT+(${markerPosition[1]}+${markerPosition[0]})&rasters=${raster.uuid}&srs=EPSG:4326&start=2008-01-01T12:00:00&stop=2017-12-31T18:00:00&window=2635200000`
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
  render() {
    const position = [52.1858, 5.2677];
    const {
      availableGroups,
      availableMessages,
      comparison,
      markerPosition,
      messages,
      raster,
      showConfigureRecipients,
      showConfigureThreshold,
      step,
      thresholds,
      timeseries
    } = this.state;
    return (
      <div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <div id="steps" style={{ margin: "20px 0 0 20px" }}>
                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator indicator="1" active={step === 1} />
                    <div className="media-body">
                      <h5
                        className={`mt-0 ${this.state.step !== 1
                          ? "text-muted"
                          : null}`}
                      >
                        Raster selection
                      </h5>
                      {step === 1 ? (
                        <div>
                          <p className="text-muted">
                            Which temporal raster do you want to use?<br />
                            The name of the raster will be used in e-mail and
                            SMS alerts.
                          </p>
                          <div className="form-group">
                            <SelectRaster
                              placeholderText="Type the name here"
                              results={this.state.rasters}
                              loading={this.state.loading}
                              onInput={this.handleRasterSearchInput}
                              setRaster={this.handleSetRaster}
                            />
                            <button
                              type="button"
                              className="btn btn-success"
                              style={{ marginTop: 10 }}
                              onClick={() => {
                                if (this.state.raster) {
                                  this.setState({
                                    step: 2
                                  });
                                }
                              }}
                            >
                              Next step
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator indicator="2" active={step === 2} />
                    <div className="media-body">
                      <h5
                        className={`mt-0 ${step !== 2 ? "text-muted" : null}`}
                      >
                        Point-on-map
                      </h5>
                      {step === 2 ? (
                        <div>
                          <p className="text-muted">
                            Set the location of this alarm by placing a marker
                            (tap/click on the map)
                          </p>

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
                                url={`https://nxt.staging.lizard.net/api/v3/wms/`}
                                styles={raster.options.styles}
                                layers={raster.wms_info.layer}
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
                            className="btn btn-success"
                            style={{ marginTop: 10 }}
                            onClick={() => {
                              if (markerPosition) {
                                this.loadTimeseriesData();
                                this.setState({
                                  step: 3
                                });
                              }
                            }}
                          >
                            Next step
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-link"
                            style={{ marginLeft: 15, marginTop: 10 }}
                            onClick={() =>
                              this.setState({
                                step: 1
                              })}
                          >
                            Back
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator indicator="3" active={step === 3} />
                    <div className="media-body">
                      <h5
                        className={`mt-0 ${step !== 3 ? "text-muted" : null}`}
                      >
                        Thresholds
                      </h5>
                      {step === 3 ? (
                        <div>
                          <p className="text-muted">
                            This alarm will be triggered whenever a threshold is
                            exceeded.
                          </p>
                          <div className="form-group">
                            <label htmlFor="comparison">Comparison</label>
                            <select
                              onChange={e =>
                                this.handleChangeComparison(e.target.value)}
                              value={this.state.comparison}
                              className="form-control form-control-lg"
                              id="comparison"
                            >
                              <option value=">">&gt;</option>
                              <option value="<">&lt;</option>
                            </select>
                            <small className="form-text text-muted">
                              Comparison for all alarm thresholds, either &lt;
                              or &gt;
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
                                    Alarm when value {comparison}{" "}
                                    {threshold.value}
                                  </span>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link float-right"
                                    onClick={() => console.log("remove")}
                                  >
                                    Remove
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
                            className="btn btn-success"
                            style={{ marginTop: 10 }}
                            onClick={() => {
                              this.setState({
                                step: 4
                              });
                            }}
                          >
                            Next step
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="media">
                  <StepIndicator indicator="4" active={step === 4} />
                  <div className="media-body">
                    <h5 className={`mt-0 ${step !== 4 ? "text-muted" : null}`}>
                      Recipients
                    </h5>
                    {step === 4 ? (
                      <div>
                        <p className="text-muted">
                          When an alarm is triggered, these groups of recipients
                          will be notified.
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
                          className="btn btn-success"
                          style={{ marginTop: 10 }}
                          onClick={this.handleActivateClick}
                        >
                          Activate
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
    currentOrganisation: state.bootstrap.organisation,
    isFetching: state.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doCreateAlarm: data => dispatch(createAlarm(data))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewNotification)
);

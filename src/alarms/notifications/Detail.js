import AddButton from "../../components/AddButton";
import buttonStyles from "../../styles/Buttons.css";
import ConfigureThreshold from "./ConfigureThreshold";
import gridStyles from "../../styles/Grid.css";
import { FormattedMessage } from "react-intl";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import RecipientGroups from "./RecipientGroups";
import styles from "./Detail.css";
import ThresholdChart from "./ThresholdChart";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import { withRouter } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <h3>
          <FormattedMessage
            id="notifications_app.something_wrong"
            defaultMessage="Something went wrong..."
          />
        </h3>
      );
    }
    return this.props.children;
  }
}

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableGroups: [],
      availableMessages: [],
      groups: [],
      hasError: false,
      loadingComplete: false,
      messages: [],
      alarm: null,
      rasterdetail: null,
      showConfigureThreshold: false,
      timeseriesdetail: null
    };
    this.hideConfigureThreshold = this.hideConfigureThreshold.bind(this);
    this.handleAddThreshold = this.handleAddThreshold.bind(this);
    this.fetchAlarmAndRasterDetails = this.fetchAlarmAndRasterDetails.bind(
      this
    );
    this.fetchContactsAndMessages = this.fetchContactsAndMessages.bind(this);
    this.activateAlarm = this.activateAlarm.bind(this);
    this.deActivateAlarm = this.deActivateAlarm.bind(this);
    this.removeThresholdByIdx = this.removeThresholdByIdx.bind(this);
  }
  componentDidMount() {
    const { match, selectedOrganisation } = this.props;
    const organisationId = selectedOrganisation.uuid;

    document.addEventListener("keydown", this.hideConfigureThreshold, false);

    this.fetchAlarmAndRasterDetails(match.params.id);
    this.fetchContactsAndMessages(organisationId);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.hideConfigureThreshold, false);
  }
  componentDidCatch() {
    this.setState(state => ({ ...state, hasError: true }));
  }
  fetchContactsAndMessages(organisationId) {
    (async () => {
      try {
        const groups = await fetch(
          `/api/v3/contactgroups/?organisation__unique_id=${organisationId}&page_size=0`,
          {
            credentials: "same-origin"
          }
        ).then(response => response.json());

        const messages = await fetch(
          `/api/v3/messages/?organisation__unique_id=${organisationId}&page_size=0`,
          {
            credentials: "same-origin"
          }
        ).then(response => response.json());

        this.setState({
          availableMessages: messages,
          availableGroups: groups
        });
      } catch (e) {
        throw new Error(e);
      }
    })();
  }

  fetchAlarmAndRasterDetails(rasterUuid) {
    (async () => {
      const alarm = this.props.alarmType === "RASTERS" ? 
        await fetch(`/api/v3/rasteralarms/${rasterUuid}/`, {
          credentials: "same-origin"
        }).then(response => response.json()) :
        await fetch(`/api/v3/timeseriesalarms/${rasterUuid}/`, {
          credentials: "same-origin"
        }).then(response => response.json());

      let rasterdetail = null;
      let timeseriesdetail = null;

      if (alarm.intersection) {
        // MARK: Hack to get relative URL
        const parser = document.createElement("a");
        parser.href = alarm.intersection.raster;
        rasterdetail = await fetch(parser.pathname, {
          credentials: "same-origin"
        }).then(response => response.json());
      }

      if (alarm.intersection) {
        const markerPosition = alarm.intersection.geometry.coordinates;
        timeseriesdetail = await fetch(
          `/api/v3/raster-aggregates/?agg=curve&geom=POINT+(${markerPosition[1]}+${markerPosition[0]})&rasters=${rasterdetail.uuid}&srs=EPSG:4326&start=2008-01-01T12:00:00&stop=2017-12-31T18:00:00&window=2635200000`,
          {
            credentials: "same-origin"
          }
        ).then(response => response.json());
      }

      this.setState({
        alarm,
        rasterdetail,
        timeseriesdetail,
        loadingComplete: true
      });
    })();
  }

  hideConfigureThreshold(e) {
    if (e.key === "Escape") {
      this.setState({
        showConfigureThreshold: false
      });
    }
  }

  handleAddThreshold(value, warning_level) {
    const { addNotification } = this.props;
    const { alarm } = this.state;

    const updatedThresholds = [
      ...alarm.thresholds,
      {
        value: value,
        warning_level: warning_level
      }
    ];

    fetch(`${this.props.alarmType === "RASTERS" ? `/api/v3/rasteralarms/${alarm.uuid}/` : `/api/v3/timeseriesalarms/${alarm.uuid}/`}`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thresholds: updatedThresholds
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          ...this.state,
          alarm: {
            ...this.state.alarm,
            thresholds: updatedThresholds
          }
        });
        addNotification(
          `Threshold with value ${value} (${warning_level}) added`,
          2000
        );
      });
  }

  activateAlarm(uuid) {
    const { addNotification } = this.props;

    fetch(`${this.props.alarmType === "RASTERS" ? `/api/v3/rasteralarms/${uuid}/` : `/api/v3/timeseriesalarms/${uuid}/`}`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: true
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          alarm: { ...this.state.alarm, active: true }
        });
        addNotification(`Alarm "${data.name}" activated`, 2000);
      });
  }

  deActivateAlarm(uuid) {
    const { addNotification } = this.props;

    fetch(`${this.props.alarmType === "RASTERS" ? `/api/v3/rasteralarms/${uuid}/` : `/api/v3/timeseriesalarms/${uuid}/`}`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: false
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          alarm: { ...this.state.alarm, active: false }
        });
        addNotification(`Alarm "${data.name}" deactivated`, 2000);
      });
  }

  removeAlarm(uuid) {
    const { history, addNotification } = this.props;
    fetch(`${this.props.alarmType === "RASTERS" ? `/api/v3/rasteralarms/${uuid}/` : `/api/v3/timeseriesalarms/${uuid}/`}`, {
      credentials: "same-origin",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    }).then(response => {
      if (response.status === 204) {
        addNotification(`Alarm removed`, 2000);
        history.push("/alarms/notifications");
      }
    });
  }

  removeThresholdByIdx(uuid, idx) {
    const { addNotification } = this.props;
    (async () => {
      const thresholds = await fetch(`${this.props.alarmType === "RASTERS" ? `/api/v3/rasteralarms/${uuid}/` : `/api/v3/timeseriesalarms/${uuid}/`}`, {
        credentials: "same-origin",
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(response => response.json())
        .then(json => json.thresholds);

      const sliced_thresholds = [
        ...thresholds.slice(0, idx),
        ...thresholds.slice(idx + 1)
      ];

      fetch(`${this.props.alarmType === "RASTERS" ? `/api/v3/rasteralarms/${uuid}/` : `/api/v3/timeseriesalarms/${uuid}/`}`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thresholds: sliced_thresholds
        })
      })
        .then(response => response.json())
        .then(data => {
          addNotification(`Threshold removed from alarm`, 2000);
          this.setState({
            alarm: {
              ...this.state.alarm,
              thresholds: sliced_thresholds
            }
          });
        });
    })();
  }

  render() {
    const {
      availableGroups,
      availableMessages,
      hasError,
      loadingComplete,
      alarm,
      rasterdetail,
      showConfigureThreshold,
      timeseriesdetail
    } = this.state;

    if (hasError) {
      return <div>Sorry, something went wrong</div>;
    }

    if (!loadingComplete) {
      return (
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
      );
    }

    const currentAlarm = alarm;
    currentAlarm.rasterdetail = rasterdetail;
    currentAlarm.timeseriesdetail = timeseriesdetail;

    if (!currentAlarm) {
      return null;
    }

    const thresholds = currentAlarm.thresholds.map((threshold, i) => {
      console.log(currentAlarm)
      let alarmName = "";
      let unit = "";
      try {
        alarmName = currentAlarm.observation_type.parameter.toLowerCase();
        unit = currentAlarm.observation_type.unit;
      } catch (e) {}
      return (
        <div
          key={threshold.warning_level + i}
          className={styles.ThresHoldsList}
        >
          <div>
            <i
              style={{
                position: "relative",
                top: 5,
                left: 0
              }}
              className="material-icons"
            >
              access_time
            </i>&nbsp; Alarm when {alarmName} {currentAlarm.comparison}{" "}
            {threshold.value} {unit} ({threshold.warning_level.toLowerCase()})
          </div>
          <div>
            <button
              type="button"
              onClick={() => this.removeThresholdByIdx(currentAlarm.uuid, i)}
              className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link} ${gridStyles.FloatRight}`}
            >
              <FormattedMessage
                id="notifications_app.remove"
                defaultMessage="Remove"
              />
            </button>
          </div>
        </div>
      );
    });

    const map = currentAlarm.rasterdetail ? (
      <Map
        bounds={[
          [
            currentAlarm.rasterdetail.spatial_bounds.south,
            currentAlarm.rasterdetail.spatial_bounds.west
          ],
          [
            currentAlarm.rasterdetail.spatial_bounds.north,
            currentAlarm.rasterdetail.spatial_bounds.east
          ]
        ]}
        className={styles.MapStyle}
      >
        <TileLayer
          url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <WMSTileLayer
          url={`/api/v3/wms/`}
          styles={currentAlarm.rasterdetail.options.styles}
          layers={currentAlarm.rasterdetail.wms_info.layer}
          opacity={0.9}
        />
        <TileLayer
          url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.0a5c8e74/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {currentAlarm.intersection ? (
          <Marker
            position={[
              currentAlarm.intersection.geometry.coordinates[1],
              currentAlarm.intersection.geometry.coordinates[0]
            ]}
          />
        ) : null}
      </Map>
    ) : null;

    const chart = currentAlarm.timeseriesdetail ? (
      <ThresholdChart
        timeseries={currentAlarm.timeseriesdetail.data}
        value={currentAlarm.warning_threshold}
        parameter={
          currentAlarm.rasterdetail.observation_type
            ? currentAlarm.rasterdetail.observation_type.parameter
            : null
        }
        unit={
          currentAlarm.rasterdetail.observation_type
            ? currentAlarm.rasterdetail.observation_type.unit
            : null
        }
        code={
          currentAlarm.rasterdetail.observation_type
            ? currentAlarm.rasterdetail.observation_type.code
            : null
        }
      />
    ) : null;

    const number_of_thresholds = currentAlarm.thresholds.length;
    const number_of_messages = currentAlarm.messages.length;

    return (
      <ErrorBoundary>
        <div className={gridStyles.Container}>
          <div className={gridStyles.Row}>
            <div
              className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
            >
              <div className={styles.Header}>
                <div className={styles.HeaderLeft}>
                  <div
                    className={`${currentAlarm.active
                      ? styles.Active
                      : styles.InActive} ${styles.ActiveIndicator}`}
                  >
                    {currentAlarm.active ? (
                      <FormattedMessage
                        id="alarmtemplates_app.active"
                        defaultMessage="ACTIVE"
                      />
                    ) : (
                      <FormattedMessage
                        id="alarmtemplates_app.inactive"
                        defaultMessage="INACTIVE"
                      />
                    )}
                  </div>
                  <div>
                    <p className={styles.Name}>{currentAlarm.name}</p>
                    <p className={`text-muted ${styles.Counts}`}>
                      <FormattedMessage
                        id="alarmtemplates_app.number_of_thresholds"
                        defaultMessage={`{number_of_thresholds, number} {number_of_thresholds, plural, 
                one {threshold}
                other {thresholds}}`}
                        values={{ number_of_thresholds }}
                      />
                      {", "}
                      <FormattedMessage
                        id="alarmtemplates_app.number_of_messages"
                        defaultMessage={`{number_of_messages, number} {number_of_messages, plural, 
                one {recipient}
                other {recipient groups}}`}
                        values={{ number_of_messages }}
                      />
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                  onClick={() =>
                    currentAlarm.active
                      ? this.deActivateAlarm(currentAlarm.uuid)
                      : this.activateAlarm(currentAlarm.uuid)}
                >
                  {currentAlarm.active ? (
                    <FormattedMessage
                      id="alarmtemplates_app.deactivate"
                      defaultMessage="DEACTIVATE"
                    />
                  ) : (
                    <FormattedMessage
                      id="alarmtemplates_app.activate"
                      defaultMessage="ACTIVATE"
                    />
                  )}
                </button>

                <button
                  type="button"
                  className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                  onClick={() => {
                    if (window.confirm("Are you sure?")) {
                      this.removeAlarm(currentAlarm.uuid);
                    }
                  }}
                >
                  <FormattedMessage
                    id="notifications_app.remove"
                    defaultMessage="Remove"
                  />
                </button>
              </div>
            </div>
          </div>
          <hr />

          <div className={gridStyles.Row}>
            <div
              className={`${gridStyles.colLg5} ${gridStyles.colMd5} ${gridStyles.colSm5} ${gridStyles.colXs12}`}
            >
              <h3>
                {" "}
                <FormattedMessage
                  id="notifications_app.map"
                  defaultMessage="Map"
                />
              </h3>
              {map || (
                <p>
                  {" "}
                  <FormattedMessage
                    id="notifications_app.not_available"
                    defaultMessage="Not available"
                  />
                </p>
              )}
              <hr />
              <h3>
                {" "}
                <FormattedMessage
                  id="notifications_app.chart"
                  defaultMessage="Chart"
                />
              </h3>
              {chart || (
                <p>
                  {" "}
                  <FormattedMessage
                    id="notifications_app.not_available"
                    defaultMessage="Not available"
                  />
                </p>
              )}
            </div>
            <div
              className={`${gridStyles.colLg7} ${gridStyles.colMd7} ${gridStyles.colSm7} ${gridStyles.colXs12}`}
            >
              <div className={gridStyles.Row}>
                <div
                  className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
                >
                  <AddButton
                    style={{ marginBottom: 10, float: "right" }}
                    handleClick={() =>
                      this.setState({
                        showConfigureThreshold: true
                      })}
                    title="Add threshold"
                  />
                  <h3>
                    {" "}
                    <FormattedMessage
                      id="notifications_app.thresholds"
                      defaultMessage="Thresholds"
                    />
                  </h3>
                </div>
              </div>
              <div className={gridStyles.Row}>
                <div
                  className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
                >
                  {thresholds}
                </div>
              </div>
              <hr />
              <div className={gridStyles.Row}>
                <div
                  className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
                >
                  <RecipientGroups
                    currentAlarm={currentAlarm}
                    availableGroups={availableGroups}
                    availableMessages={availableMessages}
                  />
                </div>
              </div>
            </div>
          </div>

          {showConfigureThreshold ? (
            <ConfigureThreshold
              handleAddThreshold={this.handleAddThreshold}
              raster={currentAlarm.rasterdetail}
              timeseries={currentAlarm.timeseriesdetail}
              handleClose={() =>
                this.setState({ showConfigureThreshold: false })}
            />
          ) : null}
        </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedOrganisation: state.organisations.selected,
    alarmType: state.alarmType
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };

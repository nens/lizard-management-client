import AddButton from "../../components/AddButton";
import buttonStyles from "../../styles/Buttons.css";
import ConfigureThreshold from "./ConfigureThreshold";
import gridStyles from "../../styles/Grid.css";
import MDSpinner from "react-md-spinner";
import pluralize from "pluralize";
import React, { Component } from "react";
import styles from "./Detail.css";
import ThresholdChart from "./ThresholdChart";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import { withRouter } from "react-router-dom";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfigureThreshold: false,
      availableGroups: [],
      availableMessages: [],
      loadingComplete: false,
      messages: [],
      groups: [],
      rasteralarm: null,
      rasterdetail: null,
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
    const { bootstrap, match } = this.props;
    const organisationId = bootstrap.organisation.unique_id;

    document.addEventListener("keydown", this.hideConfigureThreshold, false);

    // Load the raster alarm detail data and 
    this.fetchAlarmAndRasterDetails(match.params.id);

    this.fetchContactsAndMessages(organisationId);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.hideConfigureThreshold, false);
  }

  fetchContactsAndMessages(organisationId) {
    (async () => {
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
      const rasteralarm = await fetch(`/api/v3/rasteralarms/${rasterUuid}/`, {
        credentials: "same-origin"
      }).then(response => response.json());

      let rasterdetail = null;
      let timeseriesdetail = null;

      if (rasteralarm.intersection) {
        // MARK: Hack to get relative URL
        const parser = document.createElement("a");
        parser.href = rasteralarm.intersection.raster;
        rasterdetail = await fetch(parser.pathname, {
          credentials: "same-origin"
        }).then(response => response.json());
      }

      if (rasteralarm.intersection) {
        const markerPosition = rasteralarm.intersection.geometry.coordinates;
        timeseriesdetail = await fetch(
          `/api/v3/raster-aggregates/?agg=curve&geom=POINT+(${markerPosition[1]}+${markerPosition[0]})&rasters=${rasterdetail.uuid}&srs=EPSG:4326&start=2008-01-01T12:00:00&stop=2017-12-31T18:00:00&window=2635200000`,
          {
            credentials: "same-origin"
          }
        ).then(response => response.json());
      }

      this.setState({
        rasteralarm,
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
    this.props.addThresholdToAlarm(
      this.props.match.params.id,
      value,
      warning_level
    );
  }

  activateAlarm(uuid) {
    const { addNotification } = this.props;

    fetch(`/api/v3/rasteralarms/${uuid}/`, {
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
          rasteralarm: { ...this.state.rasteralarm, active: true }
        });
        addNotification(`Alarm "${data.name}" activated`, 2000);
      });
  }

  deActivateAlarm(uuid) {
    const { addNotification } = this.props;

    fetch(`/api/v3/rasteralarms/${uuid}/`, {
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
          rasteralarm: { ...this.state.rasteralarm, active: false }
        });
        addNotification(`Alarm "${data.name}" deactivated`, 2000);
      });
  }

  removeAlarm(uuid) {
    const { history, addNotification } = this.props;
    fetch(`/api/v3/rasteralarms/${uuid}/`, {
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
    (async () => {
      const thresholds = await fetch(`/api/v3/rasteralarms/${uuid}`, {
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

      fetch(`/api/v3/rasteralarms/${uuid}/`, {
        credentials: "same-origin",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thresholds: sliced_thresholds
        })
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            rasteralarm: {
              ...this.state.rasteralarm,
              thresholds: sliced_thresholds
            }
          });
        });
    })();
  }

  render() {
    const {
      showConfigureThreshold,
      availableGroups,
      availableMessages,
      loadingComplete,
      rasteralarm,
      rasterdetail,
      timeseriesdetail
    } = this.state;
    const { removeMessageFromAlarmByIdx } = this.props;

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

    const currentAlarm = rasteralarm;
    currentAlarm.rasterdetail = rasterdetail;
    currentAlarm.timeseriesdetail = timeseriesdetail;

    if (!currentAlarm) {
      return null;
    }

    const thresholds = currentAlarm.thresholds.map((threshold, i) => {
      let alarmName = "";
      let unit = "";
      try {
        alarmName = currentAlarm.observation_type.parameter.toLowerCase();
        unit = currentAlarm.observation_type.unit;
      } catch (e) {}
      return (
        <div key={i} className={styles.ThresHoldsList}>
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
              Remove
            </button>
          </div>
        </div>
      );
    });

    const recipientGroups = currentAlarm.messages.map((message, i) => {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: 5
          }}
          key={i}
        >
          <div>
            <select
              style={{ marginRight: 5 }}
              defaultValue={message.contact_group.id}
            >
              {availableGroups.map((g, i) => {
                return (
                  <option key={Math.floor(Math.random() * 100000)} value={g.id}>
                    {g.name.slice(0, 25)}
                  </option>
                );
              })}
            </select>
            <select defaultValue={message.message.id}>
              {availableMessages.map((m, j) => {
                return (
                  <option key={Math.floor(Math.random() * 100000)} value={m.id}>
                    {m.name.slice(0, 25)}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            type="button"
            onClick={() => removeMessageFromAlarmByIdx(currentAlarm.uuid, i)}
            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
          >
            Remove
          </button>
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

    return (
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
                  {currentAlarm.active ? "ACTIVE" : "INACTIVE"}
                </div>
                <div>
                  <p className={styles.Name}>{currentAlarm.name}</p>
                  <p className={`text-muted ${styles.Counts}`}>
                    {currentAlarm.thresholds.length}{" "}
                    {pluralize("threshold", currentAlarm.thresholds.length)},{" "}
                    {currentAlarm.messages.length}{" "}
                    {pluralize(
                      "recipient group",
                      currentAlarm.messages.length
                    )}{" "}
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
                {currentAlarm.active ? "Deactivate" : "Activate"}
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
                Remove
              </button>
            </div>
          </div>
        </div>
        <hr />

        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg5} ${gridStyles.colMd5} ${gridStyles.colSm5} ${gridStyles.colXs12}`}
          >
            <h3>Map</h3>
            {map || <p>Not available</p>}
            <hr />
            <h3>Chart</h3>
            {chart || <p>Not available</p>}
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
                <h3>Thresholds</h3>
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
                <AddButton
                  style={{ marginBottom: 10, float: "right" }}
                  handleClick={() => console.log("Add group")}
                  title="Add group"
                />
                <h3>Recipient groups</h3>
              </div>
            </div>
            <div className={gridStyles.Row}>
              <div
                className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
              >
                {recipientGroups}
              </div>
            </div>
          </div>
        </div>
        {showConfigureThreshold ? (
          <ConfigureThreshold
            handleAddThreshold={this.handleAddThreshold}
            raster={currentAlarm.rasterdetail}
            timeseries={currentAlarm.timeseriesdetail.data}
            handleClose={() => this.setState({ showConfigureThreshold: false })}
          />
        ) : null}
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

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };

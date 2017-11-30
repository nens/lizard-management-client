import React, { Component } from "react";
import MDSpinner from "react-md-spinner";
import ThresholdChart from "./ThresholdChart";
// import Ink from "react-ink";
// import { FormattedMessage } from "react-intl";
import { Map, Marker, TileLayer, WMSTileLayer } from "react-leaflet";
import AddButton from "../../components/AddButton";
import pluralize from "pluralize";
import { connect } from "react-redux";
import {
  fetchNotificationDetailsById,
  removeAlarm,
  activateAlarm,
  deActivateAlarm
} from "../../actions";
import styles from "./Detail.css";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import { withRouter } from "react-router-dom";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { match, doFetchNotificationDetails } = this.props;
    doFetchNotificationDetails(match.params.id);
  }
  render() {
    const {
      isFetching,
      doRemoveAlarm,
      doActivateAlarm,
      doDeActivateAlarm,
      currentAlarm
    } = this.props;
    if (isFetching) {
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
        <div key={i} className={styles.GroupsList}>
          {message.message.name} / {message.contact_group.name}
          <button
            type="button"
            className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link} ${gridStyles.FloatRight}`}
          >
            Remove
          </button>
        </div>
      );
    });

    const map = (currentAlarm.rasterdetail) ?
        <Map
          onClick={this.handleMapClick}
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
            // url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.iaa98k8k/{z}/{x}/{y}.png"
            url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.5641a12c/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <WMSTileLayer
            url={`https://nxt.staging.lizard.net/api/v3/wms/`}
            styles={currentAlarm.rasterdetail.options.styles}
            layers={currentAlarm.rasterdetail.wms_info.layer}
            opacity={0.9}
          />
          <TileLayer
            url="https://{s}.tiles.mapbox.com/v3/nelenschuurmans.0a5c8e74/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {currentAlarm.intersection ? (
            <Marker position={[currentAlarm.intersection.geometry.coordinates[1],currentAlarm.intersection.geometry.coordinates[0]]} />
          ) : null}
        </Map> : null;

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
                    ? doDeActivateAlarm(currentAlarm.uuid)
                    : doActivateAlarm(currentAlarm.uuid)}
              >
                {currentAlarm.active ? "Deactivate" : "Activate"}
              </button>

              <button
                type="button"
                className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
                onClick={() => {
                  if (window.confirm("Are you sure?")) {
                    doRemoveAlarm(currentAlarm.uuid);
                    this.props.history.push("/alarms/notifications");
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
                  handleClick={() => console.log("Add threshold")}
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
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state);
  return {
    currentAlarm: state.alarms._alarms.currentAlarm || null,
    notification: state.alarms.alarm,
    isFetching: state.alarms.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doFetchNotificationDetails: id => {
      dispatch(fetchNotificationDetailsById(id));
    },
    doRemoveAlarm: uuid => dispatch(removeAlarm(uuid)),
    doActivateAlarm: uuid => dispatch(activateAlarm(uuid)),
    doDeActivateAlarm: uuid => dispatch(deActivateAlarm(uuid))
  };
};

Detail = withRouter(connect(mapStateToProps, mapDispatchToProps)(Detail));

export { Detail };

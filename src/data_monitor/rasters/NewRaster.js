import buttonStyles from "../../styles/Buttons.css";
import ConfigureRecipients from "./ConfigureRecipients";
import ConfigureThreshold from "./ConfigureThreshold";
import debounce from "lodash.debounce";
import formStyles from "../../styles/Forms.css";
import gridStyles from "../../styles/Grid.css";
import React, { Component } from "react";
import StepIndicator from "../../components/StepIndicator";
import styles from "./NewNotification.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router-dom";
import { NewRasterName } from "./NewRasterName";
import SelectOrganisation from "../../components/SelectOrganisation";

async function fetchOrganisations() {
  try {
    const organisations = await fetch(
      "/api/v3/organisations/?format=json&page_size=1000000",
      {
        credentials: "same-origin"
      }
    )
      .then(response => response.json())
      .then(data => (data.results ? data.results : data));

    return organisations;
  } catch (e) {
    throw new Error(e);
  }
}

class NewRasterModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      rasterName: "",
      organisations: [{ name: "hardcoded example" }],
      rasterOrganisation: {
        name: "",
        unique_id: ""
      },
      assets: [],
      comparison: ">",
      loading: false,
      markerPosition: null,
      messages: [],
      name: null,
      numberOfRecipientGroups: 0,
      raster: null,
      rasters: [],
      showConfigureThreshold: false,
      thresholds: []
    };
    this.setCurrentStep = this.setCurrentStep.bind(this);
    this.setRasterName = this.setRasterName.bind(this);
    this.setRasterOrganisation = this.setRasterOrganisation.bind(this);

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
  setCurrentStep(currentStep) {
    this.setState({
      currentStep: currentStep
    });
  }
  setRasterName(name) {
    this.setState({
      rasterName: name
    });
  }
  setRasterOrganisation(rasterOrganisation) {
    console.log(rasterOrganisation);
    this.setState({
      rasterOrganisation: rasterOrganisation
    });
  }

  componentDidMount() {
    const { bootstrap } = this.props;
    const organisationId = bootstrap.organisation.unique_id;

    document.getElementById("rasterName").focus();
    document.addEventListener("keydown", this.hideConfigureThreshold, false);

    // fetchOrganisations().then(organisations=>{
    //   this.setState({
    //     organisations: organisations
    //   });
    // });
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
        currentStep: 2
      });
    }
  }
  handleChangeComparison(value) {
    this.setState({
      comparison: value
    });
  }
  handleActivateClick(e) {
    const { bootstrap, history, addNotification } = this.props;
    const organisationId = bootstrap.organisation.unique_id;

    const {
      rasterName,
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
        name: rasterName,
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
    const { bootstrap } = this.props;
    const organisationId = bootstrap.organisation.unique_id;

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

    // console.log("spatial bounds:", raster.spatial_bounds);

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
    return fetch(
      `/api/v3/raster-aggregates/?agg=curve&geom=POINT+(${markerPosition[1]}+${markerPosition[0]})&rasters=${raster.uuid}&srs=EPSG:4326&start=2008-01-01T12:00:00&stop=2017-12-31T18:00:00&window=2635200000`,
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
    if (toStep < this.state.currentStep) {
      this.setState({
        currentStep: toStep
      });
    }
  }
  render() {
    const position = [52.1858, 5.2677];

    const {
      rasterName,
      organisations,
      rasterOrganisation,
      raster,
      loading,
      showConfigureRecipients,
      showConfigureThreshold,
      currentStep,
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
                <NewRasterName
                  step={1}
                  currentStep={currentStep}
                  rasterName={rasterName}
                  setRasterName={this.setRasterName}
                  setCurrentStep={this.setCurrentStep}
                />
                <div className={styles.Step} id="Step">
                  <div className="media">
                    <StepIndicator
                      indicator="2"
                      active={currentStep === 2}
                      handleClick={() => this.goBackToStep(2)}
                    />
                    <div
                      style={{
                        width: "calc(100% - 90px)",
                        marginLeft: 90
                      }}
                    >
                      <h3
                        className={`mt-0 ${currentStep !== 2
                          ? "text-muted"
                          : null}`}
                      >
                        <FormattedMessage
                          id="raster.organisation_selection"
                          defaultMessage="Organisation"
                        />
                      </h3>
                      {currentStep === 2 ? (
                        <div>
                          <p className="text-muted">
                            <FormattedMessage
                              id="notifications_app.which_temporal_raster_to_use"
                              defaultMessage="Which temporal raster do you want to use?"
                            />
                          </p>
                          <div className={formStyles.FormGroup}>
                            <SelectOrganisation
                              placeholderText="Type to search"
                              results={organisations}
                              loading={loading}
                              selected={rasterOrganisation}
                              //onInput={this.handleRasterSearchInput}
                              //setRaster={this.handleSetRaster}
                              setValue={this.setRasterOrganisation}
                            />
                            {this.state.rasterOrganisation ? (
                              <button
                                type="button"
                                className={`${buttonStyles.Button} ${buttonStyles.Success}`}
                                style={{ marginTop: 10 }}
                                onClick={() => {
                                  if (raster) {
                                    this.setState({
                                      currentStep: 3
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

const NewRaster = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewRasterModel)
);

export { NewRaster };

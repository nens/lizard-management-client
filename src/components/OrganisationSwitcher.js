import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAll, fetchOrganisations, selectOrganisation } from "../actions";
import styles from "./OrganisationSwitcher.css";
import { Scrollbars } from "react-custom-scrollbars";
import MDSpinner from "react-md-spinner";
import CSSTransition from "react-transition-group/CSSTransition";

class OrganisationSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      filterValue: null
    };
    this.handleResize = this.handleResize.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.selectOrganisation = this.selectOrganisation.bind(this);
    this.hideOrganisationSwitcher = this.hideOrganisationSwitcher.bind(this);
  }
  componentDidMount() {
    this.props.getOrganisations();
    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.hideOrganisationSwitcher, false);
    document.getElementById("organisationName").focus();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener("keydown", this.hideOrganisationSwitcher, false);
  }
  hideOrganisationSwitcher(e) {
    if (e.key === "Escape") {
      this.props.handleClose();
    }
  }
  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
  handleInput(e) {
    this.setState({
      filterValue: e.target.value
    });
  }
  selectOrganisation(organisation) {
    this.props.selectOrganisation(organisation);
  }
  render() {
    const {
      handleClose,
      organisations,
      selectedOrganisation,
      isFetching
    } = this.props;

    const filteredOrganisations = this.state.filterValue
      ? organisations.filter(org => {
          if (org.name.toLowerCase().indexOf(this.state.filterValue) !== -1) {
            return org;
          }
          return false;
        })
      : organisations;

    return (
      <div className={styles.OrganisationSwitcherContainer}>
        <CSSTransition
          in={true}
          appear={true}
          timeout={500}
          classNames={{
            enter: styles.Enter,
            enterActive: styles.EnterActive,
            leave: styles.Leave,
            leaveActive: styles.LeaveActive,
            appear: styles.Appear,
            appearActive: styles.AppearActive
          }}
        >
          <div className={styles.OrganisationSwitcher}>
            <div className={styles.CloseButton} onClick={handleClose}>
              <i className="material-icons">close</i>
            </div>
            <h5>Switch organisation</h5>
            <br />
            <div className="form-group">
              <input
                id="organisationName"
                tabIndex="-1"
                type="text"
                className="form-control"
                placeholder="Type here to filter the list of organisations..."
                onChange={this.handleInput}
              />
            </div>
            {isFetching ? (
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
            ) : (
              <Scrollbars
                style={{ width: "100%", height: this.state.height - 400 }}
              >
                {filteredOrganisations
                  ? filteredOrganisations.map((organisation, i) => {
                      return (
                        <div
                          key={i}
                          className={`${styles.OrganisationRow} ${selectedOrganisation &&
                          organisation.unique_id ===
                            selectedOrganisation.unique_id
                            ? styles.Active
                            : null}`}
                          onClick={() => {
                            this.selectOrganisation(organisation);
                            handleClose();
                          }}
                        >
                          <i className="material-icons">group</i>
                          <div className={styles.OrganisationName}>
                            {organisation.name}
                          </div>
                        </div>
                      );
                    })
                  : null}
              </Scrollbars>
            )}
          </div>
        </CSSTransition>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    selectedOrganisation: state.bootstrap.organisation,
    organisations: state.bootstrap.organisations,
    isFetching: state.bootstrap.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getOrganisations: () => dispatch(fetchOrganisations()),
    selectOrganisation: organisation => {
      dispatch(selectOrganisation(organisation));
      dispatch(fetchAll());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  OrganisationSwitcher
);

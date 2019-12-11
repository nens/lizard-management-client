import CSSTransition from "react-transition-group/CSSTransition";
import formStyles from "../styles/Forms.css";
import MDSpinner from "react-md-spinner";
import React, { Component } from "react";
import styles from "./OrganisationSwitcher.css";
import { connect } from "react-redux";
import { fetchSupplierIds, selectOrganisation } from "../actions";
import { FormattedMessage, injectIntl } from "react-intl";
import { Scrollbars } from "react-custom-scrollbars";
import doArraysHaveEqualElement from '../utils/doArraysHaveEqualElement';
import {appTiles} from '../home/HomeAppTileConfig';


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
    window.addEventListener("resize", this.handleResize, false);
    document.addEventListener("keydown", this.hideOrganisationSwitcher, false);
    document.getElementById("organisationName").focus();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    document.removeEventListener(
      "keydown",
      this.hideOrganisationSwitcher,
      false
    );
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

    const currentHomeAppTile = appTiles.find(icon => {
      return window.location.href.includes(icon.linksTo.path)
    });
    const authorisationText = this.props.intl.formatMessage({ id: "authorization.organisation_not_allowed_current_page", defaultMessage: "! Organisation not authorized to visit current page !" });

        

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
            <h3>
              <FormattedMessage
                id="components.switch_org"
                defaultMessage="Switch organisation"
              />
            </h3>
            <br />
            <div className={formStyles.FormGroup}>
              <input
                id="organisationName"
                tabIndex="-1"
                type="text"
                className={formStyles.FormControl}
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
                      const hasRequiredRoles = !currentHomeAppTile || doArraysHaveEqualElement(organisation.roles, currentHomeAppTile.requiredRoles);
                      return (
                        <div
                          key={organisation.uuid}
                          className={`${styles.OrganisationRow} ${selectedOrganisation &&
                          organisation.uuid === selectedOrganisation.uuid
                            ? styles.Active
                            : styles.InActive}`}
                          onClick={() => {
                            this.selectOrganisation(organisation);
                            handleClose();
                          }}
                        >
                          <i className="material-icons">group</i>
                          <div className={styles.OrganisationName}>
                            {organisation.name}
                          </div>
                          <div className={styles.OrganisationAuthorised}>
                          {!hasRequiredRoles? authorisationText  : null}
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
    selectedOrganisation: state.organisations.selected,
    organisations: state.organisations.available,
    isFetching: state.organisations.isFetching
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectOrganisation: organisation => {
      dispatch(selectOrganisation(organisation));
      dispatch(fetchSupplierIds());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(OrganisationSwitcher)
);

import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import MDSpinner from "react-md-spinner";
import { fetchTaskInstance } from "./api/tasks";
import {
  addNotification,
  fetchLizardBootstrap,
  fetchOrganisations,
  updateViewportDimensions,
  fetchDatasets,
  updateTaskStatus,
  removeFileFromQueue
} from "./actions";
import {
  getShouldFetchOrganisations,
  getUserAuthenticated,
  getSelectedOrganisation,
  getFilesInProcess,
} from './reducers';
import {Routes} from './home/Routes';
import {NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import LanguageSwitcher from "./components/LanguageSwitcher";
import OrganisationSwitcher from "./components/OrganisationSwitcher";
import Snackbar from "./components/Snackbar";
import Breadcrumbs from "./components/Breadcrumbs";
import UploadQueue from "./components/UploadQueue";
import styles from "./App.module.css";
import gridStyles from "./styles/Grid.module.css";
import buttonStyles from "./styles/Buttons.module.css";
import lizardIcon from "./images/lizard.svg";

import helpIcon from './images/help.svg'
import documentIcon from './images/document.svg';
import logoutIcon from './images/logout.svg';
import editIcon from './images/edit.svg';
import shouldRedirectBasedOnAuthorization from './home/shouldRedirectBasedOnAuthorization';
import packageJson from '../package.json';
import {navigationLinkTiles, getCurrentNavigationLinkPage} from './home/AppTileConfig';
import LoginProfileDropdown from "./components/LoginProfileDropdown";


const App = (props: RouteComponentProps & DispatchProps) => {

  const userAuthenticated = useSelector(getUserAuthenticated);
  const shouldFetchOrganisations = useSelector(getShouldFetchOrganisations);
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const showOrganisationPicker = userAuthenticated && !shouldFetchOrganisations && selectedOrganisation;
  const filesInProcess = useSelector( getFilesInProcess);

  const currentRelativeUrl = props.location.pathname;
  console.log('currentRelativeUrl', currentRelativeUrl)
  

  const [showOrganisationSwitcher, setShowOrganisationSwitcher] = useState(false);
  const [showUploadQueue, setShowUploadQueue] = useState(false);
  

  // fetch if user is authenticated
  useEffect(() => {
    props.fetchLizardBootstrap();
  }, []);
  useEffect(() => {
    if (userAuthenticated && getShouldFetchOrganisations) {
      props.fetchOrganisations();
    }
  }, [userAuthenticated, getShouldFetchOrganisations]);


  // componentDidUpdate(prevProps) {
  //   if (this.props.uploadFiles && prevProps.uploadFiles !== this.props.uploadFiles) {
  //     const firstFileInTheQueue = this.props.filesInProcess[0];

  //     if (this.props.filesInProcess.length === 0 || !firstFileInTheQueue || !firstFileInTheQueue.uuid) return;

  //     setTimeout(() => {
  //       fetchTaskInstance(firstFileInTheQueue.uuid)
  //         .then(response => {
  //           this.props.updateTaskStatus(firstFileInTheQueue.uuid, response.status);
  //         })
  //         .catch(e => console.error(e))
  //     }, 5000);
  //   };
  // };


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     showOrganisationSwitcher: false,
  //     showProfileList: false,
  //     showUploadQueue: false
  //   };
  //   this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
  //   this.updateViewportDimensions = this.updateViewportDimensions.bind(this);
  //   this.handleWindowClose = this.handleWindowClose.bind(this);
  // }
  // //Click the user-profile button open the dropdown
  // //Click anywhere outside of the user-profile modal will close the modal
  // onUserProfileClick = (e) => {
  //   return e.target.id === "user-profile" ? 
  //     this.setState({ showProfileList: !this.state.showProfileList }) : 
  //     this.setState({ showProfileList: false });
  // }

  // componentDidMount() {
  //   window.addEventListener("offline", e => this.updateOnlineStatus(e));
  //   window.addEventListener("resize", e => this.updateViewportDimensions(e));
  //   window.addEventListener("beforeunload", this.handleWindowClose);
  //   // only needs to be done if user is
  //   this.props.getLizardBootstrap();
  // }
  // componentWillUnmount() {
  //   window.removeEventListener("offline", e => this.updateOnlineStatus(e));
  //   window.removeEventListener("resize", e => this.updateViewportDimensions(e));
  //   window.removeEventListener("beforeunload", this.handleWindowClose);
  // }
  // componentWillReceiveProps(props) {
  //   if (props.isAuthenticated) {
  //     if (props.mustFetchOrganisations) props.getOrganisations();
  //     if (props.mustFetchDatasets) props.getDatasets();
  //   }
  // }
  // updateOnlineStatus(e) {
  //   const { addNotification } = this.props;
  //   addNotification(`Your internet connection seems to be ${e.type}`, 2000);
  // }
  // updateViewportDimensions() {
  //   const { updateViewportDimensions } = this.props;
  //   const { innerWidth, innerHeight } = window;
  //   updateViewportDimensions(innerWidth, innerHeight);
  // }
  // handleWindowClose(e) {
  //   e.preventDefault();
  //   if (this.props.uploadingFiles && this.props.uploadingFiles.length > 0) {
  //     return e.returnValue = "";
  //   } else {
  //     return null;
  //   };
  // }

  // // Poll the task endpoint to update status of uploading/processing files in the queue
  // componentDidUpdate(prevProps) {
  //   if (this.props.uploadFiles && prevProps.uploadFiles !== this.props.uploadFiles) {
  //     const firstFileInTheQueue = this.props.filesInProcess[0];

  //     if (this.props.filesInProcess.length === 0 || !firstFileInTheQueue || !firstFileInTheQueue.uuid) return;

  //     setTimeout(() => {
  //       fetchTaskInstance(firstFileInTheQueue.uuid)
  //         .then(response => {
  //           this.props.updateTaskStatus(firstFileInTheQueue.uuid, response.status);
  //         })
  //         .catch(e => console.error(e))
  //     }, 5000);
  //   };
  // };

    // if ( 
    //   this.props.availableOrganisations.length === 0 && 
    //   this.props.isFetchingOrganisations === false &&
    //   this.props.timesFetchedOrganisations > 0
    // ) {
    //   const norolesMessage = this.props.intl.formatMessage({ id: "authorization.no_roles_message", defaultMessage: "Dear user, \nYou seem not to be in any organisations that can access the management pages. \nTherefore you are redirected to the mainpage." });
    //   alert(norolesMessage);
    //   // should redirect to <customer_url>.lizard.net on prod
    //   window.location = "/";
    // }

    // Todo make a better function for this, also in organisationSwitcher
    // This find function relies on the ordering of the tiles
    // also the "!icon.onUrl.includes(icon.linksToUrl)" is needed to the back icon is not found
    // const currentHomeAppTile = navigationLinkTiles.find(icon => {
    //   return window.location.href.includes(icon.linksToUrl) &&
    //     // back icon cannot be current homeAppTile
    //     !icon.onUrl.includes(icon.linksToUrl)
    // });
    const currentNavigationLinkPage = getCurrentNavigationLinkPage();

    console.log('currentNavigationLinkPage', currentNavigationLinkPage);

    // if (
    //   !this.props.bootstrap.isAuthenticated && 
    //   !this.props.bootstrap.isFetching &&
    //   currentNavigationLinkPage
      
    //   ) {
    //   this.props.getLizardBootstrap();
    // }

    // if (shouldRedirectBasedOnAuthorization(this.props.bootstrap, this.props.selectedOrganisation)) {
    //   const redirectMessage = this.props.intl.formatMessage({ id: "authorization.redirected_based_onrole", defaultMessage: "You do not have the rights to access this data under the selected organisation. \nYou will be redirected." });
    //   alert(redirectMessage);
    //   // should redirect to <customer_url>.lizard.net/management/ on prod
    //   this.props.history.push("/");
    // }
    
    // if (!this.props.isAuthenticated || !this.props.selectedOrganisation) {
    //   return (
    //     <div className={styles.MDSpinner}>
    //       <MDSpinner size={24} />
    //     </div>
    //   );
    // } else {
      // const { preferredLocale, bootstrap, selectedOrganisation } = this.props;
      // const firstName = bootstrap.bootstrap.user
      //   ? bootstrap.bootstrap.user.first_name
      //   : "...";
      // const { showOrganisationSwitcher } = this.state;

      return (
        <div className={styles.App} 
        // onClick={this.onUserProfileClick}
        >
          <div className={`${styles.Primary}`}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <div
                  style={{ height: "55px" }}
                  className={`${gridStyles.colLg4} ${gridStyles.colMd4} ${gridStyles.colSm4} ${gridStyles.colXs12}`}
                >
                  <NavLink to="/" title={"client-version: " +packageJson.version}>
                    <img src={`${lizardIcon}`} alt="Lizard logo" className={styles.LizardLogo} />
                  </NavLink>
                </div>
                <div
                  className={`${gridStyles.colLg8} ${gridStyles.colMd8} ${gridStyles.colSm8} ${gridStyles.colXs12}`}
                >
                  <div className={styles.TopNav}>
                    <div style={{ display: "none" }}>
                      <a href="#apps">
                        <i className={`material-icons ${styles.AppIcon}`}>
                          apps
                        </i>
                        Apps
                      </a>
                    </div>
                    { userAuthenticated &&  currentRelativeUrl !== '/'? 
                    <div
                      className={styles.Profile}
                      onClick={() => {
                        setShowUploadQueue(true)
                      }}
                    >
                      <div>
                        <i className="fa fa-upload" style={{ paddingRight: 8 }} />
                        {filesInProcess && filesInProcess.length > 0 ? <span className={styles.NavNotification}>!</span> : null}
                        Upload queue
                      </div>
                    </div>
                    :null}
                   
                    { 
                      showOrganisationPicker?
                      <div
                        className={styles.OrganisationLinkContainer}
                        onClick={() => {
                          setShowOrganisationSwitcher(true);
                        }}
                      >
                        <button
                          className={`${buttonStyles.ButtonLink} ${styles.OrganisationLink}`}
                          title={
                            selectedOrganisation
                              ? selectedOrganisation.name
                              : "Select organisation"
                          }
                        >
                          <i className="fa fa-sort" />
                          &nbsp;&nbsp;
                          {selectedOrganisation
                            ? selectedOrganisation.name
                            : "Select organisation"}
                        </button>
                      </div>
                      :
                      null
                    }
                    

                    <LoginProfileDropdown/>
                  </div> 

                </div> 
              </div>
            </div>
          </div>
          <div className={`${styles.Secondary}`}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <Breadcrumbs
                  // The same location is needed to calculate the breadcrumbs.
                  location= {props.location}
                />
              </div>
            </div>
          </div>
          <div className={gridStyles.Container + " " + styles.AppContent}>
                <Routes/>
          </div>
          <footer className={styles.Footer}>
            <div className={gridStyles.Container}>
              <div className={gridStyles.Row}>
                <div
                  className={`${styles.FooterLeft} ${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
                >
                  <a
                    href="https://docs.lizard.net/a_lizard.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FormattedMessage
                      id="index.documentation"
                      defaultMessage="Documentation"
                    />
                    &nbsp;
                    <i
                      className={`${styles.DocumentationHyperlink} material-icons`}
                    >
                      local_library
                    </i>
                  </a>
                </div>
                <div
                  className={`${styles.FooterRight} ${gridStyles.colLg6} ${gridStyles.colMd6} ${gridStyles.colSm6} ${gridStyles.colXs6}`}
                >
                  <div className={styles.FooterRightWrapper}>
                    <div style={{ margin: "0 10px 0 10px" }}>
                      {/* <LanguageSwitcher
                        locale={preferredLocale}
                        languages={[
                          { code: "nl", language: "Nederlands" },
                          { code: "en", language: "English" }
                        ]}
                      /> */}
                    </div>
                    <div>
                      <a
                        href="https://nelen-schuurmans.topdesk.net/tas/public/ssp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i
                          className={`${styles.SupportHyperlink} material-icons`}
                        >
                          headset_mic
                        </i>
                        &nbsp;
                        <FormattedMessage
                          id="index.support"
                          defaultMessage="Support"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          {showOrganisationSwitcher ? (
            <OrganisationSwitcher
              handleClose={() =>
                setShowOrganisationSwitcher(false)}
            />
          ) : null}
          <Snackbar />
          {showUploadQueue ? (
            <UploadQueue
              handleClose={() => setShowUploadQueue(false)}
            />
          ) : null}
        </div>
      );
  // }
}

// const mapStateToProps = (state, ownProps) => {
//   return {
    // isFetching: state.isFetching,
    // bootstrap: state.bootstrap,
    // isAuthenticated: state.bootstrap.isAuthenticated,
    // uploadFiles: state.uploadFiles,
    // uploadingFiles:
    //   state.uploadFiles &&
    //   state.uploadFiles.length > 0 &&
    //   state.uploadFiles.filter(file => file.status === 'WAITING' || file.status === 'UPLOADING'),
    // filesInProcess:
    //   state.uploadFiles &&
    //   state.uploadFiles.length > 0 &&
    //   state.uploadFiles.filter(file => file.status !== 'SUCCESS' && file.status !== 'FAILED'),

    // mustFetchOrganisations:
    //   state.organisations.available.length === 0 &&
    //   !state.organisations.isFetching &&
    //   state.organisations.timesFetched < 1,

    // selectedOrganisation: state.organisations.selected,
    // availableOrganisations: state.organisations.available,
    // isFetchingOrganisations: state.organisations.isFetching,
    // timesFetchedOrganisations: state.organisations.timesFetched,

    // mustFetchDatasets:
    //   state.datasets.available.length === 0 &&
    //   !state.datasets.isFetching &&
    //   state.datasets.timesFetched < 1
//   };
// };

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    fetchLizardBootstrap: () => dispatch(fetchLizardBootstrap()),
    fetchOrganisations: () => dispatch(fetchOrganisations()),
    // getDatasets: () => dispatch(fetchDatasets()),
    // addNotification: (message, timeout) => {
    //   dispatch(addNotification(message, timeout));
    // },
    // updateViewportDimensions: (width, height) => {
    //   dispatch(updateViewportDimensions(width, height))
    // },
    // updateTaskStatus: (uuid, status) => dispatch(updateTaskStatus(uuid, status)),
    // removeFileFromQueue: (file) => dispatch(removeFileFromQueue(file)),
  };
};
type DispatchProps = ReturnType<typeof mapDispatchToProps>;


export default withRouter(connect(null, mapDispatchToProps)(injectIntl(App)));

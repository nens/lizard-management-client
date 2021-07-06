import React, { useState, useEffect, useCallback } from "react";
import { connect, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
// import MDSpinner from "react-md-spinner";
import { fetchTaskInstance } from "./api/tasks";
import {
  addNotification,
  fetchLizardBootstrap,
  fetchOrganisations,
  fetchDatasets,
  updateTaskStatus,
} from "./actions";
import {
  getShouldFetchBootstrap,
  getShouldFetchOrganisations,
  getUserAuthenticated,
  getSelectedOrganisation,
  getFilesInProcess,
  getIsFetchingBootstrap,
} from './reducers';
import {Routes} from './home/Routes';
import {NavLink, withRouter, RouteComponentProps } from "react-router-dom";
import OrganisationSwitcher from "./components/OrganisationSwitcher";
import Snackbar from "./components/Snackbar";
import Breadcrumbs from "./components/Breadcrumbs";
import UploadQueue from "./components/UploadQueue";
import styles from "./App.module.css";
import gridStyles from "./styles/Grid.module.css";
import buttonStyles from "./styles/Buttons.module.css";
import lizardIcon from "./images/lizard.svg";
import packageJson from '../package.json';
import { getCurrentNavigationLinkPage, userHasCorrectRolesForCurrentNavigationLinkTile} from './home/AppTileConfig';
import LoginProfileDropdown from "./components/LoginProfileDropdown";
import UnAuthenticatedModal from "./components/UnAuthenticatedModal";
import UnAuthorizedModal from "./components/UnAuthorizedModal";



const App = (props: RouteComponentProps & DispatchProps) => {

  const {
    fetchLizardBootstrap,
    fetchOrganisations,
    getDatasets,
    updateTaskStatus,
    addNotification,
  } = props;

  const userAuthenticated = useSelector(getUserAuthenticated);
  const isBusyFetchingBootstrap = useSelector(getIsFetchingBootstrap);
  const shouldFetchBootstrap =  useSelector(getShouldFetchBootstrap);
  const shouldFetchOrganisations = useSelector(getShouldFetchOrganisations);
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const showOrganisationPicker = userAuthenticated && !shouldFetchOrganisations && selectedOrganisation;
  const filesInProcess = useSelector( getFilesInProcess);
  const firstFileInTheQueue = filesInProcess && filesInProcess[0];
  const currentRelativeUrl = props.location.pathname;
  
  const [showOrganisationSwitcher, setShowOrganisationSwitcher] = useState(false);
  const [showUploadQueue, setShowUploadQueue] = useState(false);
  const [showUnauthenticatedRedirectModal, setShowUnauthenticatedRedirectModal] = useState(false);
  const [showUnAuthorizedRedirectModal, setShowUnAuthorizedRedirectModal] = useState(false);

  

  // fetch if user is authenticated
  useEffect(() => {
    if (shouldFetchBootstrap) {
      fetchLizardBootstrap();
    }
  }, [fetchLizardBootstrap, shouldFetchBootstrap]);
  useEffect(() => {
    if (userAuthenticated && shouldFetchOrganisations) {
      fetchOrganisations();
      getDatasets();
    }
  }, [userAuthenticated, shouldFetchOrganisations, fetchOrganisations, getDatasets]);

  useEffect(() => {
    if (firstFileInTheQueue && firstFileInTheQueue.uuid) {
      setTimeout(() => {
        fetchTaskInstance(firstFileInTheQueue.uuid)
          .then(response => {
            updateTaskStatus(firstFileInTheQueue.uuid, response.status);
          })
          .catch(e => console.error(e))
      }, 5000);
    }
  }, [firstFileInTheQueue, updateTaskStatus]);

  const handleWindowClose = useCallback(event => {
    event.preventDefault();
    
    if (filesInProcess && filesInProcess.length > 0) {
      return event.returnValue = "";
    } else {
      return null;
    };
  }, [filesInProcess]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleWindowClose);

    // todo, should other logic concerning a warning on close also be handled here? Or in the forms?

    // removing event listener not needed since the logic is in the eventlistener itself?
    // return () => {
    //   window.removeEventListener('beforeunload', handleWindowClose);
    // };
  }, [handleWindowClose, filesInProcess]);

  const updateOnlineStatus = useCallback(event => {
    addNotification(`Your internet connection seems to be ${event.type}`, 2000);
  },[addNotification])
  useEffect(() => {
    window.addEventListener('offline', updateOnlineStatus);
  }, [updateOnlineStatus, addNotification]);

  // //////////////////////////////////////////////////////////////////////////////

  const currentNavigationLinkPage = getCurrentNavigationLinkPage();
  useEffect(() => {
    if (
      ( currentNavigationLinkPage === undefined || // it is not one of the pages that just show tiles
        currentNavigationLinkPage.onUrl !== '/'  // it is the home
      ) && !userAuthenticated && !isBusyFetchingBootstrap
    ) {
      setShowUnauthenticatedRedirectModal(true);
    }
  }, [currentNavigationLinkPage, userAuthenticated, isBusyFetchingBootstrap]);

  const userHasCorrectRoles = userHasCorrectRolesForCurrentNavigationLinkTile(selectedOrganisation? selectedOrganisation.roles: []);
  useEffect(() => {
    if (
      userAuthenticated &&
      selectedOrganisation &&
      !userHasCorrectRoles &&
      !showOrganisationSwitcher
    ) {
      setShowUnAuthorizedRedirectModal(true);
    }
  }, [userHasCorrectRoles, userAuthenticated, showOrganisationSwitcher, selectedOrganisation]);
  
    // if (!this.props.isAuthenticated || !this.props.selectedOrganisation) {
    //   return (
    //     <div className={styles.MDSpinner}>
    //       <MDSpinner size={24} />
    //     </div>
    //   );
    // } else {
      

      return (
        <div className={styles.App} 
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
                    { userAuthenticated && selectedOrganisation && currentRelativeUrl !== '/'? 
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
          { showUnauthenticatedRedirectModal?
          <UnAuthenticatedModal
            handleClose={()=>{setShowUnauthenticatedRedirectModal(false)}}
            redirectHome={()=>{
              setShowUnauthenticatedRedirectModal(false);
              props.history.push("/");
            }}
          />
        :null}
        { showUnAuthorizedRedirectModal?
          <UnAuthorizedModal
            handleClose={()=>{setShowUnAuthorizedRedirectModal(false)}}
            redirectHome={()=>{
              setShowUnAuthorizedRedirectModal(false);
              props.history.push("/");
            }}
            handleOpenOrganisationSwitcher={()=>{
              setShowUnAuthorizedRedirectModal(false);
              setShowOrganisationSwitcher(true);
            }}
          />
        :null}
        </div>
      );
}



const mapDispatchToProps = (dispatch: any, ownProps: any) => {
  return {
    fetchLizardBootstrap: () => dispatch(fetchLizardBootstrap()),
    fetchOrganisations: () => dispatch(fetchOrganisations()),
    getDatasets: () => dispatch(fetchDatasets()),
    addNotification: (message: string, timeout: number) => {
      dispatch(addNotification(message, timeout));
    },
    updateTaskStatus: (uuid: string, status: number) => dispatch(updateTaskStatus(uuid, status)),
  };
};
type DispatchProps = ReturnType<typeof mapDispatchToProps>;


export default withRouter(connect(null, mapDispatchToProps)(injectIntl(App)));

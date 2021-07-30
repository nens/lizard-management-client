import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { fetchTaskInstance } from "./api/tasks";
import {
  addNotification,
  fetchLizardBootstrap,
  fetchOrganisations,
  fetchDatasets,
  updateTaskStatus,
  openCloseUploadQueueModal,
} from "./actions";
import {
  getShouldFetchBootstrap,
  getShouldFetchOrganisations,
  getUserAuthenticated,
  getSelectedOrganisation,
  getFilesInProcess,
  getIsNotFinishedFetchingBootstrap,
  getShowUploadQueueModal,
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
import {getCurrentNavigationLinkPage, userHasCorrectRolesForCurrentNavigationLinkTile} from './home/AppTileConfig';
import LoginProfileDropdown from "./components/LoginProfileDropdown";
import UnauthenticatedModal from "./components/UnauthenticatedModal";
import UnauthorizedModal from "./components/UnauthorizedModal";

const App = (props: RouteComponentProps & DispatchProps) => {

  const {
    fetchLizardBootstrap,
    fetchOrganisations,
    getDatasets,
    updateTaskStatus,
    addNotification,
  } = props;

  const userAuthenticated = useSelector(getUserAuthenticated);
  const isNotFinishedFetchingBootstrap = useSelector(getIsNotFinishedFetchingBootstrap);
  const shouldFetchBootstrap =  useSelector(getShouldFetchBootstrap);
  const shouldFetchOrganisations = useSelector(getShouldFetchOrganisations);
  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const showOrganisationPicker = userAuthenticated && !shouldFetchOrganisations && selectedOrganisation;
  const filesInProcess = useSelector( getFilesInProcess);
  const firstFileInTheQueueUuid = filesInProcess && filesInProcess[0] && filesInProcess[0].uuid;
  const currentRelativeUrl = props.location.pathname;
  const isLandingPage = currentRelativeUrl === "/";
  const showUploadQueue = useSelector(getShowUploadQueueModal);
  
  const [showOrganisationSwitcher, setShowOrganisationSwitcher] = useState(false);
  const [showUnauthenticatedRedirectModal, setShowUnauthenticatedRedirectModal] = useState(false);
  const [showUnauthorizedRedirectModal, setshowUnauthorizedRedirectModal] = useState(false);


  

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
    if (firstFileInTheQueueUuid) {
      const interval = setInterval(() => {
        fetchTaskInstance(firstFileInTheQueueUuid)
          .then(response => {
            updateTaskStatus(firstFileInTheQueueUuid, response.status);
          })
          .catch(e => console.error(e))
      }, 5000);
      return () => clearInterval(interval);
    };
    // updateTaskStatus is excluded from the dependency array
    // because this fuction causes the effect to be called repeatedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstFileInTheQueueUuid]);

  
  useEffect(() => {
    const updateOnlineStatus = ((event: Event) => {
      addNotification(`Your internet connection seems to be ${event.type}`, 2000);
    })
    window.addEventListener('offline', updateOnlineStatus);
  }, [addNotification]);

  const currentNavigationLinkPage = getCurrentNavigationLinkPage();
  useEffect(() => {
    if (
      ( currentNavigationLinkPage === undefined || // it is not one of the pages that just show tiles
        currentNavigationLinkPage.onUrl !== '/'  // it is the home
      ) && !userAuthenticated && !isNotFinishedFetchingBootstrap
    ) {
      setShowUnauthenticatedRedirectModal(true);
    }
  }, [currentNavigationLinkPage, userAuthenticated, isNotFinishedFetchingBootstrap]);

  const userHasCorrectRoles = userHasCorrectRolesForCurrentNavigationLinkTile(selectedOrganisation? selectedOrganisation.roles: []);
  useEffect(() => {
    if (
      userAuthenticated &&
      selectedOrganisation &&
      !userHasCorrectRoles &&
      !showOrganisationSwitcher
    ) {
      setshowUnauthorizedRedirectModal(true);
    }
  }, [userHasCorrectRoles, userAuthenticated, showOrganisationSwitcher, selectedOrganisation]);

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
                    { userAuthenticated && selectedOrganisation && !isLandingPage? 
                    <div
                      className={styles.Profile}
                      onClick={() => {
                        props.openCloseUploadQueueModal(true);
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
                      showOrganisationPicker && !isLandingPage?
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
          {currentRelativeUrl !== "/"?
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
          :null}
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
              handleClose={()=> props.openCloseUploadQueueModal(false)}
            />
          ) : null}
          { showUnauthenticatedRedirectModal?
          <UnauthenticatedModal
            handleClose={()=>{setShowUnauthenticatedRedirectModal(false)}}
            redirectHome={()=>{
              setShowUnauthenticatedRedirectModal(false);
              props.history.push("/");
            }}
          />
        :null}
        { showUnauthorizedRedirectModal?
          <UnauthorizedModal
            handleClose={()=>{setshowUnauthorizedRedirectModal(false)}}
            redirectHome={()=>{
              setshowUnauthorizedRedirectModal(false);
              props.history.push("/");
            }}
            handleOpenOrganisationSwitcher={()=>{
              setshowUnauthorizedRedirectModal(false);
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
    openCloseUploadQueueModal: (isOpen: boolean) => dispatch(openCloseUploadQueueModal(isOpen)),
  };
};
type DispatchProps = ReturnType<typeof mapDispatchToProps>;


export default withRouter(connect(null, mapDispatchToProps)(injectIntl(App)));

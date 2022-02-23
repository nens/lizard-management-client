import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch } from "..";
import { getSelectedOrganisation, getOrganisations } from '../reducers';
import { OrganisationWithRoles } from '../types/organisationType';
import CSSTransition from "react-transition-group/CSSTransition";
import formStyles from "../styles/Forms.module.css";
import MDSpinner from "react-md-spinner";

import styles from "./OrganisationSwitcher.module.css";
import { connect } from "react-redux";
import { selectOrganisation } from "../actions";
import { FormattedMessage } from "react-intl.macro";

import { Scrollbars } from "react-custom-scrollbars";
import { userHasCorrectRolesForCurrentNavigationLinkTile } from '../home/AppTileConfig';
// import { useIntl } from 'react-intl';
// import { formattedMessageToString } from './../utils/translationUtils';


interface PropsArgs {
  handleClose: () => void,
}

type Props = PropsArgs & DispatchProps

const OrganisationSwitcher = (props:Props) => {
  
  const [height, setHeight] = useState(window.innerHeight);
  const [filterValue, setFilterValue] = useState<null | string>(null);
  // const intl = useIntl();

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    document.addEventListener("keydown", hideOrganisationSwitcher, false);
    const organisationNameElement = document.getElementById("organisationName");
    organisationNameElement && organisationNameElement.focus();
    return () => {
      window.removeEventListener("resize", handleResize, false);
      document.removeEventListener(
        "keydown",
        hideOrganisationSwitcher,
        false
      );
    };
  });

  // Todo howto remove this any
  const hideOrganisationSwitcher:any = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      props.handleClose();
    }
  }
  const handleResize = () => {
    setHeight(window.innerHeight);
  }
  
  // todo fix this any
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue( e.target.value);
  }
  
  const {
    handleClose,      
  } = props;

  const selectedOrganisation = useSelector(getSelectedOrganisation);
  const reduxOrganisations = useSelector(getOrganisations);
  const isFetching = reduxOrganisations.isFetching;
  const organisations = reduxOrganisations.available;

  const filteredOrganisations = filterValue
    ? organisations.filter(org => {
      if (org.name.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1) {
          return org;
        }
        return false;
      })
    : organisations;

  // const authorisationTextForTranslation = formattedMessageToString(<FormattedMessage id="authorization.organisation_not_allowed_current_page" defaultMessage="! Organisation not authorized to visit current page !"/>, intl);
  const authorisationText = "! Organisation not authorized to visit current page !";
      

  return (
    <div className={styles.OrganisationSwitcherContainer}>
      <CSSTransition
        in={true}
        appear={true}
        timeout={500}
        classNames={{
          enter: styles.Enter,
          enterActive: styles.EnterActive,
          exit: styles.Leave,
          exitActive: styles.LeaveActive,
          appear: styles.Appear,
          appearActive: styles.AppearActive
        }}
      >
        <div className={styles.OrganisationSwitcher}>
          <div className={styles.CloseButton} onClick={handleClose}>
            <i className="material-icons">close</i>
          </div>
          <h3>
            {0?<FormattedMessage
              id="components.switch_org"
              defaultMessage="Switch organisation"
            />:null}
            Switch organisation
          </h3>
          <br />
          <div className={formStyles.FormGroup}>
            <input
              id="organisationName"
              tabIndex={-1}
              type="text"
              className={formStyles.FormControl}
              placeholder="Type here to filter the list of organisations..."
              onChange={handleInput}
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
              style={{ width: "100%", height: height - 400 }}
            >
              {filteredOrganisations
              // Todo fix any og organisation
                ? filteredOrganisations.map((organisation:any, i:number) => {
                    const hasRequiredRoles = userHasCorrectRolesForCurrentNavigationLinkTile(organisation.roles);
                    return (
                      <div
                        key={organisation.uuid}
                        className={`${styles.OrganisationRow} ${selectedOrganisation &&
                        organisation.uuid === selectedOrganisation.uuid
                          ? styles.Active
                          : styles.InActive}`}
                        onClick={() => {
                          props.selectOrganisation(organisation);
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

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    selectOrganisation: (organisation: OrganisationWithRoles) => dispatch(selectOrganisation(organisation))
  };
};

type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(
  (OrganisationSwitcher)
);

import React from 'react';
import { useState } from "react";
import styles from './LoginProfileDropdown.module.css';
import {  useSelector } from "react-redux";
import {
  getBootstrap, 
  getUserAuthenticated,
  getSsoLogin,
  getSsoLogout,
  getUserFirstName,
} from '../reducers';
import { FormattedMessage, } from "react-intl";

// import helpIcon from '../images/help.svg'
import documentIcon from '../images/document.svg';
import logoutIcon from '../images/logout.svg';
// import editIcon from '../images/edit.svg';
import supportIcon from "../images/support_profile_dropdown.svg";


const LoginProfileDropdown = () => {

  const bootstrap = useSelector(getBootstrap);
  const authenticated = useSelector(getUserAuthenticated);
  const ssoLogin = useSelector(getSsoLogin);
  const ssoLogout = useSelector(getSsoLogout);
  const userFirstName = useSelector(getUserFirstName)

  const [dropDownOpen, setDropdownOpen] = useState(false);

  return (
    <div 
      style={
        bootstrap.isFetching? {visibility: "hidden"} : {}
      }
      className={styles.Profile}
    >
      <a
        href={`${ssoLogin}&next=${window.location.href}`}
        title={"click to login"}
        style={authenticated? {display: "none"}:{}}
      >
        <i className={`fa fa-user ${styles.ProfileIcon}`}/>
        <span>Login</span>
      </a>
      
      <button
        onClick={()=>{
          setDropdownOpen(true);
        }}
        style={!authenticated? {display: "none"}:{}}
      >
        <i className={`fa fa-user ${styles.ProfileIcon}`}/>
        <span className={styles.UserName} >{userFirstName}</span>
      </button>

      <div
        className={styles.DropdownMenu}
        onMouseLeave={() => setDropdownOpen(false)}
        style={!dropDownOpen? {display: "none"}:{}}
      >
        {/* profile for now not supported */}
        {/* <a
          className={styles.DropdownMenuRow}
          href="https://sso.lizard.net/edit_profile/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={editIcon} alt={'Profile'} />
          <span>Profile</span>
        </a> */}
        {/* language switcher no longer needed, but we might need it in future */}
        {/* <LanguageSwitcher
          locale={preferredLocale}
          languages={[
            { code: "nl", language: "Nederlands" },
            { code: "en", language: "English" }
          ]}
        /> */}
        
        <a
          className={styles.DropdownMenuRow}
          href="https://docs.lizard.net/a_lizard.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={documentIcon} alt={'Documentation'} />
          <span>
            <FormattedMessage
              id="index.documentation"
              defaultMessage="Documentation"
            />
          </span>
        </a>
        <a
          className={styles.DropdownMenuRow}
          href="https://nelen-schuurmans.topdesk.net/tas/public/ssp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={supportIcon} alt={'Support'} />
          <span>Support</span>
        </a>
        <a
          className={styles.DropdownMenuRow}
          href={ssoLogout}
        >
          <img src={logoutIcon} alt={'Logout'} />
          <span>Logout</span>
        </a>
      </div>
    </div>
  )
};

export default LoginProfileDropdown;
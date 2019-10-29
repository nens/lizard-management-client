import React from "react";
import { FormattedMessage } from "react-intl";
import alarmIcon from "../images/alarm@3x.svg";
import userManagementIcon from "../images/usermanagement.svg";
import templateIcon from "../images/templates@3x.svg";

const appIcons = [
  {
    requiredRoles: ["manager"],
    key: 0,
    linksTo: {
      external: true,
      path: "/management/users/"
    },
    title: (
      <FormattedMessage
        id="home.usermanagement"
        defaultMessage="User management"
      />
    ),
    icon: userManagementIcon,
    subTitle: (
      <FormattedMessage
        id="home.sso_management"
        defaultMessage="Single sign-on account management"
      />
    )
  },
  {
    requiredRoles: ["admin"],
    key: 1,
    linksTo: {
      external: false,
      path: "/alarms"
    },
    title: <FormattedMessage id="home.alarms" defaultMessage="Alarms" />,
    icon: alarmIcon,
    subTitle: (
      <FormattedMessage
        id="home.alarm_management"
        defaultMessage="Alarm management"
      />
    )
  },
  {
    requiredRoles: ["admin", "supplier"],
    key: 2,
    linksTo: {
      external: false,
      path: "/data_management"
    },
    title: (
      <FormattedMessage
        id="home.data_management"
        defaultMessage="Data Management"
      />
    ),
    icon: templateIcon,
    subTitle: (
      <FormattedMessage
        id="home.data_administration"
        defaultMessage="Data administration"
      />
    )
  }
];

export {appIcons};
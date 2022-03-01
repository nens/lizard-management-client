import React from "react";
import styles from "./UserRoles.module.css";
import formStyles from "../styles/Forms.module.css";
import { useSelector } from "react-redux";
import { getUserId } from "../reducers";
import { User } from "../types/userType";

interface MyProps {
  title: string;
  name: string;
  value: string[];
  valueChanged: (value: string[]) => void;
  currentUser: User | undefined;
  onFocus?: (e: any) => void;
  onBlur?: () => void;
  readOnly?: boolean;
  forTable?: boolean; // to reuse this component for the user table with some extra styling
}

export const UserRoles: React.FC<MyProps> = (props) => {
  const { title, name, value, valueChanged, currentUser, onFocus, onBlur, forTable } = props;

  const userId = useSelector(getUserId);
  const availableRoles = ["user", "supplier", "admin", "manager"];

  const editRole = (role: string) => {
    if (value.includes(role)) {
      if (!currentUser && value.length === 1) return; // for new user, at least one role is required
      if (currentUser && currentUser.id === userId && role === "manager") return; // manager cannot remove his own manager role but can remove manager role of other managers
      return valueChanged(value.filter((r) => r !== role));
    } else {
      return valueChanged([...value, role]);
    }
  };

  const showRole = (role: string) => {
    const firstLetterOfRole = role.charAt(0).toUpperCase();
    return (
      <div
        id={name}
        key={role}
        title={firstLetterOfRole + role.slice(1)} // Role name with first letter capitalized
        className={value.includes(role) ? `${styles.Role} ${styles.RoleSelected}` : styles.Role}
        style={{
          backgroundColor:
            role === "user"
              ? "#008080"
              : role === "supplier"
              ? "#5B4794"
              : role === "admin"
              ? "#D1D100"
              : role === "manager"
              ? "#AE0000"
              : undefined,
          cursor: forTable ? "default" : undefined,
          visibility: forTable && !value.includes(role) ? "hidden" : undefined,
        }}
        onClick={() => editRole(role)}
        tabIndex={0}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <span>{firstLetterOfRole}</span>
      </div>
    );
  };

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
      style={{
        marginBottom: forTable ? 0 : undefined,
      }}
    >
      <span
        className={formStyles.LabelTitle}
        style={{
          marginBottom: forTable ? 0 : undefined,
        }}
      >
        {title}
      </span>
      <div className={styles.Roles}>{availableRoles.map((role) => showRole(role))}</div>
    </label>
  );
};

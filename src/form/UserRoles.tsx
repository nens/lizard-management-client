import React from "react";
import styles from "./UserRoles.module.css";
import formStyles from "../styles/Forms.module.css";
import { useSelector } from "react-redux";
import { getUserId } from "../reducers";

interface MyProps {
  title: string,
  name: string,
  value: string[],
  valueChanged: (value: string[]) => void,
  currentUser: any,
  onFocus?: (e: any) => void,
  onBlur?: () => void,
  readOnly?: boolean,
  forTable?: boolean,
};

export const UserRoles: React.FC<MyProps> = (props) => {
  const {
    title,
    name,
    value,
    valueChanged,
    currentUser,
    onFocus,
    onBlur,
    forTable,
  } = props;

  const userId = useSelector(getUserId);

  const editRole = (role: string) => {
    if (value.includes(role)) {
      if (!currentUser && value.length === 1) return; // for new user, at least one role is required
      if (currentUser && currentUser.id === userId && role === 'manager') return; // manager cannot remove his own manager role but can remove manager role of other managers
      return valueChanged(value.filter(r => r !== role));
    } else {
      return valueChanged([...value, role]);
    };
  };

  return (
    <label
      htmlFor={name}
      className={formStyles.Label}
      style={{
        marginBottom: forTable ? 0 : undefined
      }}
    >
      <span
        className={formStyles.LabelTitle}
        style={{
          marginBottom: forTable ? 0 : undefined
        }}
      >
        {title}
      </span>
      <div
        className={styles.Roles}
      >
        <div
          id={name}
          title={'User'}
          className={value.includes('user') ? `${styles.Role} ${styles.RoleSelected}` : styles.Role}
          style={{
            backgroundColor: '#008080',
            cursor: forTable ? 'default' : undefined
          }}
          onClick={() => editRole('user')}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span>U</span>
        </div>
        <div
          id={name}
          title={'Supplier'}
          className={value.includes('supplier') ? `${styles.Role} ${styles.RoleSelected}` : styles.Role}
          style={{
            backgroundColor: '#5B4794',
            cursor: forTable ? 'default' : undefined
          }}
          onClick={() => editRole('supplier')}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span>S</span>
        </div>
        <div
          id={name}
          title={'Admin'}
          className={value.includes('admin') ? `${styles.Role} ${styles.RoleSelected}` : styles.Role}
          style={{
            backgroundColor: '#D1D100',
            cursor: forTable ? 'default' : undefined
          }}
          onClick={() => editRole('admin')}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span>A</span>
        </div>
        <div
          id={name}
          title={'Manager'}
          className={value.includes('manager') ? `${styles.Role} ${styles.RoleSelected}` : styles.Role}
          style={{
            backgroundColor: '#AE0000',
            cursor: forTable ? 'default' : undefined
          }}
          onClick={() => editRole('manager')}
          tabIndex={0}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <span>M</span>
        </div>
      </div>
    </label>
  );
}
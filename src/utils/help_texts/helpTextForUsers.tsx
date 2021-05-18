import React from 'react';
import styles from './helpTextForUsers.module.css';

import {
  HelpText,
} from './defaultHelpText';

const roleLabels = (
  <>
    <p>Role labels:</p>
    <ul>
      <li><b style={{ color: '#008080' }}>U</b> - User</li>
      <li><b style={{ color: '#5B4794' }}>S</b> - Supplier</li>
      <li><b style={{ color: '#D1D100' }}>A</b> - Admin</li>
      <li><b style={{ color: '#AE0000' }}>M</b> - Manager</li>
    </ul>
  </>
);

export const userTableHelpText = (
  <>
    <p>List of users. Select an user to edit his/her roles or click on the <b>New Item</b> button on the top right corner to invite a new user.</p>
    {roleLabels}
  </>
);

export const userFormHelpText: HelpText = {
  default: (
    <>
      <p>Form to edit roles of an existing user or to invite a new user.</p>
      {roleLabels}
    </>
  ),
  firstName: 'First name of the user.',
  lastName: 'Last name of the user.',
  username: 'Username of the user.',
  email: 'Email address of the user.',
  roles: (
    <>
      <span><b>User:</b></span>
      <ul className={styles.List}>
        <li>Can <span>read</span> data</li>
        <li>Can't <span>write</span> or <span>change</span> data</li>
      </ul>
      <span><b>Supplier:</b></span>
      <ul className={styles.List}>
        <li>Can supply (<span>write</span>) data</li>
        <li>Can't <span>read</span> or <span>write</span> data that they did not supply</li>
      </ul>
      <span><b>Administrator:</b></span>
      <ul className={styles.List}>
        <li>Can <span>read</span> and <span>write</span> data</li>
        <li>Can't <span>add</span>, <span>change</span> or <span>delete</span> users</li>
      </ul>
      <span><b>Managers:</b></span>
      <ul className={styles.List}>
        <li>Can <span>add</span>, <span>change</span> or <span>delete</span> user</li>
        <li>Can't <span>read</span>, <span>write</span> or <span>change</span> data</li>
      </ul>
    </>
  ),
}
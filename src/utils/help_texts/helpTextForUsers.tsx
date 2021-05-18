import React from 'react';

import {
  HelpText,
} from './defaultHelpText';

export const userFormHelpText: HelpText = {
  default: 'Form to edit roles of an existing user or to send invitation to add a new user.',
  firstName: 'First name of the user.',
  lastName: 'Last name of the user.',
  username: 'Username of the user.',
  email: 'Email address of the user.',
  roles: (
    <>
      <span><b>User:</b></span>
      <ul>
        <li>Can read data</li>
        <li>Can't write or change data</li>
      </ul>
      <span><b>Supplier:</b></span>
      <ul>
        <li>Can supply (write) data</li>
        <li>Can't read or write data that they did not supply</li>
      </ul>
      <span><b>Administrator:</b></span>
      <ul>
        <li>Can read and write data</li>
        <li>Can't add, change or delete users</li>
      </ul>
      <span><b>Managers:</b></span>
      <ul>
        <li>Can add, change or delete user</li>
        <li>Can't read, write or change data</li>
      </ul>
    </>
  ),
}
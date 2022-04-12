import { HelpText } from "./defaultHelpText";

const roleLabels = (
  <em>
    <span>Role labels:</span>
    <ul>
      <li>
        <b style={{ color: "#008080" }}>U</b> - User
      </li>
      <li>
        <b style={{ color: "#5B4794" }}>S</b> - Supplier
      </li>
      <li>
        <b style={{ color: "#D1D100" }}>A</b> - Admin
      </li>
      <li>
        <b style={{ color: "#AE0000" }}>M</b> - Manager
      </li>
    </ul>
  </em>
);

export const userTableHelpText = (
  <>
    <p>List of users.</p>
    <p>
      Select an user to edit his/her roles or click on the <b>New Item</b> button on the top right
      corner to invite a new user.
    </p>
    {roleLabels}
  </>
);

export const userFormHelpText: HelpText = {
  default: (
    <>
      <p>Form to edit roles of an existing user or to invite a new user.</p>
      {roleLabels}
      <em>
        <span>Tip:</span>
        <ul style={{ marginBottom: 0 }}>
          <li>
            Deselect all roles will remove the user from the organisation but will not delete the
            user's account.
          </li>
          <li>You cannot remove your own manager role.</li>
          <li>At least one role is required when invite a new user.</li>
        </ul>
      </em>
    </>
  ),
  firstName: "First name of the user.",
  lastName: "Last name of the user.",
  username: "Username of the user.",
  email: "Email address of the user.",
  roles: (
    <>
      <span>
        <b>User:</b>
      </span>
      <ul style={{ margin: "5px 0" }}>
        <li>
          Can <u>read</u> data
        </li>
        <li>
          Can't <u>write</u> or <u>change</u> data
        </li>
      </ul>
      <span>
        <b>Supplier:</b>
      </span>
      <ul style={{ margin: "5px 0" }}>
        <li>
          Can supply (<u>write</u>) data
        </li>
        <li>
          Can't <u>read</u> or <u>write</u> data that they did not supply
        </li>
      </ul>
      <span>
        <b>Administrator:</b>
      </span>
      <ul style={{ margin: "5px 0" }}>
        <li>
          Can <u>read</u> and <u>write</u> data
        </li>
        <li>
          Can't <u>add</u>, <u>change</u> or <u>delete</u> users
        </li>
      </ul>
      <span>
        <b>Managers:</b>
      </span>
      <ul style={{ margin: "5px 0" }}>
        <li>
          Can <u>add</u>, <u>change</u> or <u>delete</u> user
        </li>
        <li>
          Can't <u>read</u>, <u>write</u> or <u>change</u> data
        </li>
      </ul>
    </>
  ),
};

import { HelpText } from "./defaultHelpText";

export const contactFormHelpText: HelpText = {
  default:
    "Your contacts contain an email address, phone number and a name. Add these contacts to group to send them alarm messages when your thresholds are triggered.",
  firstName: "First name of the contact.",
  lastName: "Last name of the contact.",
  email: (
    <>
      <p>Email address to send notifications to.</p>
      <p>
        <em>If left empty, the contact only receives SMS notifications.</em>
      </p>
    </>
  ),
  phoneNumber: (
    <>
      <p>Telephone number to send notifications to.</p>
      <p>
        <em>If left empty, the contact only receives email notifications.</em>
      </p>
    </>
  ),
};

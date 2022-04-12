import { HelpText, nameHelpText } from "./defaultHelpText";

export const templateFormHelpText: HelpText = {
  default:
    "Templates are used to create messages for your alarms. You can choose between an email or text message.",
  name: nameHelpText,
  type: (
    <>
      <p>Choose which type of notifications this message sends, i.e. Email or SMS.</p>
      <p>
        <em>
          Add multiple message templates to the Recipients section of an alarm form to send both
          Email and SMS.
        </em>
      </p>
      <p>
        <em>Once the template is created, you can no longer edit this field.</em>
      </p>
    </>
  ),
  subject: (
    <>
      <p>Choose the subject of the email notification.</p>
      <p>
        <em>This does not apply to SMS messages.</em>
      </p>
    </>
  ),
  message: (
    <>
      <p>Body of the notification message that is sent.</p>
      <p>
        <em>
          Use variable blocks to enrich the message with contact information and details of the
          triggered alarm.
        </em>
      </p>
    </>
  ),
  noFurtherImpactOption: (
    <>
      <p>
        Determines whether a message will be sent when the alarm is triggered or when the alarm is
        withdrawn.
      </p>
      <p>If the checkbox is not checked, message will be sent when the alarm is triggered.</p>
      <p>
        Vice versa, if the checkbox is checked, message will be sent when the alarm is withdrawn.
      </p>
      <p>
        <em>The default selection is unchecked.</em>
      </p>
    </>
  ),
};

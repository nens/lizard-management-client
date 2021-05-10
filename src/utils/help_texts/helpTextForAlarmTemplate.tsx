import React from 'react';

import {
  HelpText,
  nameHelpText,
} from './defaultHelpText';

export const templateFormHelpText: HelpText = {
  default: 'Templates are used to create messages for your alarms. You can choose between an email or text message. Please select a field to get more information.',
  name: nameHelpText,
  type: (
    <>
      <p>Specify a type of the template.</p>
      <p><em>Once the template is created, you can no longer edit this field.</em></p>
    </>
  ),
  subject: 'Subject of the email/message.',
  message: (
    <>
      <p>Main message for the template.</p>
      <p><em>Parameter blocks can be added to the message by clicking on it.</em></p>
    </>
  ),
  noFurtherImpactOption: (
    <>
      <p>Determines whether a message will be sent when the alarm is triggered or when the alarm is withdrawn.</p>
      <p><em>If the checkbox is not checked, message will be sent when the alarm is triggered.</em></p>
      <p><em>Vice versa, if the checkbox is checked, message will be sent when the alarm is withdrawn.</em></p>
      <p><em>The default selection is unchecked.</em></p>
    </>
  ),
}
import React from 'react';

interface HelpText {
  [name: string]: string | JSX.Element
}

export const lableTypeFormHelpText: HelpText = {
  default: "Label types are different types of labels that can exist in the system.",
  name: "Name of the label type.",
  uuid: "Unique identifier of this label type.",
  description: 'Please give an accurate description of this object and its uses.',
  organisation: (
    <>
      <p>The organisation which this object belongs to.</p>
      <p><i>If you are not an administrator, this field is always pre-filled with the current organisation.</i></p>
    </>
  ),
}

export const personalApiKeysFormHelpText: HelpText = {
  default:  
  (
    <>
      <p>Personal API keys are used to authenticate external applications with <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Basic_access_authentication">basic authentication</a> as follows:</p> 
      <ul>
        <li>Username is literally  __key__ (with double underscores on bothsides of the word "key")</li>
        <li>Password is {"{your api key}"}</li>
      </ul>
      <span>For example:</span>
      <div
        style={{
          backgroundColor: "#EEEEEE",
          fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
          margin: "10px 0"
        }}
      >
        <span>username: __key__</span>
        <br/>
        <span>password: example.apikey</span>
      </div>
      <span>The API key itself is only visible on creation. It can not be looked up after.</span>
    </>
  ),
  // default: "Personal API keys can be used to authenticate external applications in Lizard",
  name: "Name of the personal api key",
  scopeWildcardReadWrite: "Defines if the key can be used to read and write data",
  scopeFtpReadWrite: "Defines if the key can be used with the FTP sever. Only one 'Personal API key' with FTP scope enabled is allowed per person.",
}
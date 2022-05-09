import { HelpText } from "./defaultHelpText";

export const personalApiKeysFormHelpText: HelpText = {
  default: (
    <>
      <p>
        Personal API keys are used to authenticate external applications with{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://en.wikipedia.org/wiki/Basic_access_authentication"
        >
          basic authentication
        </a>{" "}
        as follows:
      </p>
      <ul>
        <li>
          Username is literally __key__ (with double underscores on bothsides of the word "key")
        </li>
        <li>Password is {"{your api key}"}</li>
      </ul>
      <span>For example:</span>
      <div
        style={{
          backgroundColor: "#EEEEEE",
          fontFamily:
            "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
          margin: "10px 0",
        }}
      >
        <span>username: __key__</span>
        <br />
        <span>password: example.apikey</span>
      </div>
      <span>The API key itself is only visible on creation. It can not be looked up after.</span>
    </>
  ),
  name: "Name of the personal api key",
  scopeWildcardReadWrite: "Defines if the key can be used to read and write data",
  scopeFtpReadWrite:
    "Defines if the key can be used with the FTP sever. Only one 'Personal API key' with FTP scope enabled is allowed per person.",
};

import React, { Component } from "react";
import styles from "./RecipientGroups.css";
import buttonStyles from "../../styles/Buttons.css";

class RecipientGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    this.setState({
      messages: this.props.currentAlarm.messages
    });
  }

  render() {
    const { availableMessages, availableGroups, currentAlarm } = this.props;

    return (
      <div>
        {currentAlarm.messages.map((message, i) => {
          return (
            <div key={i} className={styles.RecipientGroup}>
              <select
                style={{ marginRight: 5 }}
                value={message.contact_group.id}
                onChange={e => {
                  console.log(e.target.value);
                }}
              >
                <option value="">-- Choose a recipient group --</option>
                {availableGroups.map((g, i) => {
                  return (
                    <option
                      key={Math.floor(Math.random() * 100000)}
                      value={g.id}
                    >
                      {g.name.slice(0, 25)}
                    </option>
                  );
                })}
              </select>
              <select
                value={message.message.id}
                onChange={e => {
                  console.log(e.target.value);
                }}
              >
                <option value="">-- Choose a template --</option>
                {availableMessages.map((m, j) => {
                  return (
                    <option
                      key={Math.floor(Math.random() * 100000)}
                      value={m.id}
                    >
                      {m.name.slice(0, 25)}
                    </option>
                  );
                })}
              </select>
              <button
                type="button"
                onClick={() => console.log("let's delete message at index ")}
                className={`${buttonStyles.Button} ${buttonStyles.Small} ${buttonStyles.Link}`}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default RecipientGroups;

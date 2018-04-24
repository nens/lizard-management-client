import AddButton from "../../components/AddButton";
import buttonStyles from "../../styles/Buttons.css";
import gridStyles from "../../styles/Grid.css";
import React, { Component } from "react";
import styles from "./RecipientGroups.css";
import { addNotification } from "../../actions";
import { connect } from "react-redux";

class RecipientGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleGroupChanged = this.handleGroupChanged.bind(this);
    this.handleTemplateChanged = this.handleTemplateChanged.bind(this);
    this.updateMessagesForRasterAlarm = this.updateMessagesForRasterAlarm.bind(
      this
    );
  }

  componentDidMount() {
    this.setState({
      messages: this.props.currentAlarm.messages
    });
  }

  handleAddRow() {
    this.setState({
      messages: [...this.state.messages, { message: {}, contact_group: {} }]
    });
  }

  updateMessagesForRasterAlarm(messages) {
    const { currentAlarm, addNotification } = this.props;

    const filteredMessages = messages.map((message, i) => {
      if (
        Object.keys(message.message).length > 0 &&
        Object.keys(message.contact_group).length > 0
      ) {
        return {
          contact_group: message.contact_group.name,
          message: message.message.name
        };
      }
      return false;
    });

    fetch(`/api/v3/rasteralarms/${currentAlarm.uuid}/`, {
      credentials: "same-origin",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: filteredMessages
      })
    })
      .then(response => response.json())
      .then(data => {
        addNotification(`Recipient group updated`, 2000);
      });
  }

  handleGroupChanged(id, idx) {
    const { availableGroups } = this.props;
    const { messages } = this.state;
    const messagesCopy = Array.from(messages);

    const selectedGroup = availableGroups.find(g => {
      if (g.id === parseInt(id, 0)) {
        return g;
      }
      return false;
    });

    messagesCopy[idx].contact_group = selectedGroup;

    this.setState(
      {
        messages: messagesCopy
      },
      () => {
        this.updateMessagesForRasterAlarm(messagesCopy);
      }
    );
  }

  handleTemplateChanged(id, idx) {
    const { availableMessages } = this.props;
    const { messages } = this.state;
    const messagesCopy = Array.from(messages);

    const selectedTemplate = availableMessages.find(t => {
      if (t.id === parseInt(id, 0)) {
        return t;
      }
      return false;
    });

    messagesCopy[idx].message = selectedTemplate;

    this.setState({
      messages: messagesCopy
    });

    this.setState(
      {
        messages: messagesCopy
      },
      () => {
        this.updateMessagesForRasterAlarm(messagesCopy);
      }
    );
  }

  deleteGroupAndMessageAtIndex(idx) {
    const sure = window.confirm("Are you sure?");
    const { messages } = this.state;
    if (sure) {
      const messagesCopy = [
        ...messages.slice(0, idx),
        ...messages.slice(idx + 1)
      ];

      this.setState(
        {
          messages: messagesCopy
        },
        () => {
          this.updateMessagesForRasterAlarm(messagesCopy);
        }
      );
    }
  }

  render() {
    const { availableMessages, availableGroups } = this.props;
    const { messages } = this.state;
    return (
      <div>
        <div className={gridStyles.Row}>
          <div
            className={`${gridStyles.colLg12} ${gridStyles.colMd12} ${gridStyles.colSm12} ${gridStyles.colXs12}`}
          >
            <AddButton
              style={{ marginBottom: 10, float: "right" }}
              handleClick={this.handleAddRow}
              title="Add group"
            />
            <h3>Recipient groups</h3>
          </div>
        </div>
        {messages.map((message, i) => {
          return (
            <div key={i} className={styles.RecipientGroup}>
              <select
                style={{ marginRight: 5 }}
                value={message.contact_group.id}
                onChange={e => {
                  this.handleGroupChanged(e.target.value, i);
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
                  this.handleTemplateChanged(e.target.value, i);
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
                onClick={() => this.deleteGroupAndMessageAtIndex(i)}
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

const mapStateToProps = (state, ownProps) => {
  return {
    bootstrap: state.bootstrap
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addNotification: (message, timeout) => {
      dispatch(addNotification(message, timeout));
    }
  };
};

RecipientGroups = connect(mapStateToProps, mapDispatchToProps)(RecipientGroups);

export default RecipientGroups;

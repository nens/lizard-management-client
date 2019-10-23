import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import AddButton from "../components/AddButton";
import GroupAndTemplateSelect from "../alarms/notifications/GroupAndTemplateSelect";

interface MyProps {
    selectedOrganisation: {
        uuid: string
    }
};

interface MyState {
    availableGroups: [],
    availableMessages: [],
    messages: Message[]
};

interface Message {
    messageId: number | null,
    groupId: number | null
}

async function fetchContactsAndMessages(organisationId: string) {
    try {
        const groups = await fetch(
            `/api/v4/contactgroups/?organisation__unique_id=${organisationId}`,
            {
                credentials: "same-origin"
            }
        )
            .then(response => response.json())
            .then(data => data.results);
        const messages = await fetch(
            `/api/v4/messages/?organisation__unique_id=${organisationId}`,
            {
                credentials: "same-origin"
            }
        )
            .then(response => response.json())
            .then(data => data.results);
        return {
            groups,
            messages
        };
    } catch (e) {
        throw new Error(e);
    }
}

class RecipientsInput extends Component<MyProps & InjectedIntlProps, MyState> {
    state: MyState = {
        availableGroups: [],
        availableMessages: [],
        messages: []
    }
    handleAddGroupAndTemplate = (object: any) => {
        const { idx, groupId, messageId } = object;
        const messages = this.state.messages.slice();
        messages[idx] = { groupId, messageId };
        this.setState({
            messages: messages
        });
    }
    removeFromGroupAndTemplate = (idx: number) => {
      this.setState(prevState => ({
        messages: [
          ...prevState.messages.slice(0, idx),
          ...prevState.messages.slice(idx + 1)
        ]
      }));
    }
    componentDidMount() {
        const organisationId = this.props.selectedOrganisation.uuid;
        fetchContactsAndMessages(organisationId).then((data: any) => {
            this.setState({
                availableGroups: data.groups,
                availableMessages: data.messages
            });
        });
    }

    render() {
        const {
            availableGroups,
            availableMessages,
            messages
        } = this.state;

        return (
            <div>
                <div>
                    {messages.map((message, i) => {
                        return (
                            <GroupAndTemplateSelect
                                key={i}
                                idx={i}
                                messageId={message.messageId}
                                groupId={message.groupId}
                                availableGroups={availableGroups}
                                availableMessages={availableMessages}
                                addGroupAndTemplate={this.handleAddGroupAndTemplate}
                                removeFromGroupAndTemplate={this.removeFromGroupAndTemplate}
                            />
                        );
                    })}
                </div>
                <AddButton
                    handleClick={() => {
                        const messages = this.state.messages.slice();
                        messages.push({
                            messageId: null,
                            groupId: null
                        });
                        this.setState({
                            messages
                        });
                    }}
                    title="Add recipients"
                />
            </div >
        )
    }
}

export default injectIntl(RecipientsInput);
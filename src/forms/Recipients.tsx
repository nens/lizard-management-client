import React, { Component } from "react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import AddButton from "../components/AddButton";
import GroupAndTemplateSelect from "../alarms/notifications/GroupAndTemplateSelect";

interface MyProps {
    selectedOrganisation: {
        uuid: string
    },
    name: string,
    value: {
        messages: Message[]
    },
    placeholder?: string,
    validators?: Function[],
    validated: boolean,
    handleEnter: (e: any) => void,
    valueChanged: Function,
    wizardStyle: boolean,
    readOnly?: boolean
};

interface MyState {
    availableGroups: [],
    availableMessages: []
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
        availableMessages: []
    }
    handleAddGroupAndTemplate = (object: any) => {
        const { idx, groupId, messageId } = object;
        const messages = [...this.props.value.messages];
        messages[idx] = { groupId, messageId };
        this.props.valueChanged({
            messages: messages
        });
    }
    removeFromGroupAndTemplate = (idx: number) => {
      const messages = [...this.props.value.messages];
      this.props.valueChanged({
        messages: messages.filter((message, i) => i !== idx)
      })
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
            availableMessages
        } = this.state;

        if (!this.props.value) return <div/>;

        const {
            messages
        } = this.props.value;

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
                        this.props.valueChanged({
                            messages: [...messages, {
                                messageId: null,
                                groupId: null
                            }]
                        });
                    }}
                    title="Add recipients"
                />
            </div >
        )
    }
}

export default injectIntl(RecipientsInput);
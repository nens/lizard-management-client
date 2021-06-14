import React from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import { Button, Checkbox, Form } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
];

export const Test = () =>  {
  return (
    <div>
      <h1>Table</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Label ribbon>hoan.phung</Label>
            </Table.Cell>
            <Table.Cell>hoan.phung@nelen-schuurmans.nl</Table.Cell>
            <Table.Cell>User</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>tom.deboer</Table.Cell>
            <Table.Cell>tom.deboer@nelen-schuurmans.nl</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>remco.gerlich</Table.Cell>
            <Table.Cell>remco.gerlich@nelen-schuurmans.nl</Table.Cell>
            <Table.Cell>Manager</Table.Cell>
          </Table.Row>
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>
              <Menu floated='right' pagination>
                <Menu.Item as='a' icon>
                  <Icon name='chevron left' />
                </Menu.Item>
                <Menu.Item as='a'>1</Menu.Item>
                <Menu.Item as='a'>2</Menu.Item>
                <Menu.Item as='a'>3</Menu.Item>
                <Menu.Item as='a'>4</Menu.Item>
                <Menu.Item as='a' icon>
                  <Icon name='chevron right' />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
      <h1>Form</h1>
      <Form>
        <Form.Field>
          <label>First Name</label>
          <input placeholder='First Name' />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input placeholder='Last Name' />
        </Form.Field>
        <Form.Select
          fluid
          label='Gender'
          options={options}
          placeholder='Gender'
          onChange={(_, { value }) => console.log(value)}
        />
        <Form.TextArea
          label='About'
          placeholder='Tell us more about you...'
        />
        <Form.Field>
          <Checkbox label='I agree to the Terms and Conditions' />
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  );
}
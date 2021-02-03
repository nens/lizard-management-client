import React from 'react';
import Form from './Form';
import { action } from '@storybook/addon-actions';

export default {
  component: Form,
  title: 'Form'
}

export const dropdown = () => <Form onSubmit={action('Submit')}/>
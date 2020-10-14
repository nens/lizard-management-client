import React from 'react';
import Table from './../components/Table';

export default {
  component: Table,
  title: 'Table'
}

export const world = () => <Table name="world" />;

export const people = () => <Table name="people" />;

export const raster = () => <Table name="raster management" />;
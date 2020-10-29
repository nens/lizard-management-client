import React from 'react';
import Test from './../Test';
import { RasterForm } from './RasterForm';
import { WmsForm } from './WmsForm';

export default {
  component: Test,
  title: 'Test'
}

export const world = () => <Test name="world" />;

export const people = () => <Test name="people" />;

export const rasterForm = () => <RasterForm />;

export const wmsForm = () => <WmsForm />;
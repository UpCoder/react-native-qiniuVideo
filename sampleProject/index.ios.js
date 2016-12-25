/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
    TextInput,
  View
} from 'react-native';
import InitialComponent from './component/initialComponent';
export default class sampleProject extends Component {
  render() {
    return (
        <InitialComponent />
    );
  }
}
AppRegistry.registerComponent('sampleProject', () => sampleProject);

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

window.LOG_LEVEL = 'DEBUG'

import config from './aws-exports'
import Amplify from 'aws-amplify'
Amplify.configure(config)

AppRegistry.registerComponent(appName, () => App);

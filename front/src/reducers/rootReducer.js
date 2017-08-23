import { combineReducers } from 'redux';
import { text } from './comments';

export default combineReducers({ storedText: text });

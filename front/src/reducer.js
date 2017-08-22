import { combineReducers } from 'redux';
import { ADD_TEXT } from './actions';

const initialState = [
  {
    id: 0,
    text: 'Hello Redux and React',
  },
];

const text = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TEXT:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
        },
      ];
    default:
      return state;
  }
};

export const store = combineReducers(
  {
    storedText: text,
  },
);

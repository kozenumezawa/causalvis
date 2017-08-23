import { ADD_TEXT } from '../actions/actions';

const initialState = [
  {
    id: 0,
    text: 'Hello Redux and React',
  },
];

export const text = (state = initialState, action) => {
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

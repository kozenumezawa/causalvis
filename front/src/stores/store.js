import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/dispatcher';
import eventConstants from '../constants/event-constants';

const CHANGE_EVENT = 'change';

let initialState = [
  {
    id: 0,
    text: 'Hello Redux and React',
  },
];

class Store extends EventEmitter {
  constructor() {
    super();

    Dispatcher.register(this.handler.bind(this));
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  handler(action) {
    switch (action.actionType) {
      case eventConstants.ADD_TEXT:
        initialState = [
          ...initialState,
          {
            id: action.id,
            text: action.text,
          },
        ];
        break;
      case eventConstants.LOAD_TIFF:
        break;
      default:
        break;
    }
    this.emitChange();
  }

  getStoredText() {
    return initialState;
  }
}

const store = new Store();

export default store;
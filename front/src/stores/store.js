import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher/dispatcher';
import eventConstants from '../constants/event-constants';

const CHANGE_EVENT = 'change';

const state = {
  allTiffList: [],
  legendTiff: null,
};

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
      case eventConstants.LOAD_TIFF:
        state.legendTiff = action.legendTiff;
        state.allTiffList = action.allTiffList;
        break;
      default:
        break;
    }
    this.emitChange();
  }

  getAllState() {
    return state;
  }
}

const store = new Store();

export default store;

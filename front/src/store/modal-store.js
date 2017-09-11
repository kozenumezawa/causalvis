import Rx from 'rx';

import { OPEN_MODAL, CLOSE_MODAL } from '../constants/event-constants';

const store = (intentSubject) => {
  const state = {
    openModal: false,
  };

  const subject = new Rx.BehaviorSubject({ state });

  intentSubject.subscribe((payload) => {
    switch (payload.type) {
      case OPEN_MODAL: {
        state.openModal = true;
        subject.onNext({ state });
        break;
      }
      case CLOSE_MODAL: {
        state.openModal = false;
        subject.onNext({ state });
        break;
      }
      default:
        subject.onNext({ state });
        break;
    }
  });
  return subject;
};

export default store;

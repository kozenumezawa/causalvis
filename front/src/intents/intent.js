import Rx from 'rx';

import {
  FETCH_TIFF,
  DATA_INIT,
  OPEN_MODAL,
  CLOSE_MODAL,
} from '../constants/event-constants';

export const intentSubject = new Rx.BehaviorSubject({ type: DATA_INIT });

export const loadTiff = (dataName, legendName) => {
  intentSubject.onNext({
    type: FETCH_TIFF,
    dataName,
    legendName,
  });
};

export const openModal = () => {
  intentSubject.onNext({
    type: OPEN_MODAL,
  });
};

export const closeModal = () => {
  intentSubject.onNext({
    type: CLOSE_MODAL,
  });
};

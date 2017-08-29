import Rx from 'rx';

import {
  FETCH_TIFF,
  DATA_INIT,
} from '../constants/event-constants';

export const intentSubject = new Rx.BehaviorSubject({ type: DATA_INIT });

export const loadTiff = (dataName, legendName) => {
  intentSubject.onNext({
    type: FETCH_TIFF,
    dataName,
    legendName,
  });
};
import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';
import { isSamplingPoint, arraySum } from '../utils/store-utils';

const removeUselessTimeSeries = (allTimeSeries, width, meanR) => {
  const newAllTimeSeries = [];
  allTimeSeries.forEach((timeSeries, idx) => {
    if (isSamplingPoint(idx, width, meanR) === false || arraySum(timeSeries) === 0) {
      return;
    }
    newAllTimeSeries.push(timeSeries);
  });
  return newAllTimeSeries;
};

const store = (intentSubject, dataSubject) => {
  const state = {
    allTimeSeries: [],
    meanR: 0,
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, dataSubject).subscribe(([payload, data]) => {
    state.meanR = 1;
    state.allTimeSeries = removeUselessTimeSeries(data.state.allTimeSeries, data.state.width, state.meanR);

    switch (payload.type) {
      case FETCH_TIFF:
        subject.onNext({ state });
        break;
      default:
        subject.onNext({ state });
        break;
    }
  });
  return subject;
};

export default store;

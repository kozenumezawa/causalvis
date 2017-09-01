import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';
import { isSamplingPoint, arraySum } from '../utils/store-utils';

const removeUselessTimeSeries = (allTimeSeries, width, meanR) => {
  const newAllTimeSeries = [];
  const sampledCoords = [];

  allTimeSeries.forEach((timeSeries, idx) => {
    if (isSamplingPoint(idx, width, meanR) === false || arraySum(timeSeries) === 0) {
      return;
    }
    const x = idx % width;
    const y = Math.floor(idx / width);
    sampledCoords.push({
      idx,
      x,
      y,
    });
    newAllTimeSeries.push(timeSeries);
  });

  return {
    newAllTimeSeries,
    sampledCoords,
  };
};

const store = (intentSubject, dataSubject) => {
  const state = {
    allTimeSeries: [],
    sampledCoords: [],
    meanR: 0,
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, dataSubject).subscribe(([payload, data]) => {
    state.meanR = 1;

    const removedData = removeUselessTimeSeries(data.state.allTimeSeries, data.state.width, state.meanR);
    state.allTimeSeries = removedData.newAllTimeSeries;
    state.sampledCoords = removedData.sampledCoords;

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

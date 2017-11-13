import Rx from 'rx';

import { FETCH_TIFF, SET_NEWDATA, SET_NEWFILTER } from '../constants/event-constants';
import { isSamplingPoint, arraySum, applyMeanFilter } from '../utils/store-utils';

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
    allTimeSeries: new Array(2),
    sampledCoords: new Array(2),
    meanR: new Array(2),
    windowSize: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, dataSubject).subscribe(([payload, data]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        state.meanR[0] = 1;
        state.meanR[1] = 1;
        state.windowSize[0] = (state.meanR[0] * 2) + 1;
        state.windowSize[1] = (state.meanR[1] * 2) + 1;

        if (data.state.allTimeSeries[0] == null) {
          subject.onNext({ state });
          return;
        }

        for (let dataIndex = 0; dataIndex < 2; dataIndex += 1) {
          const removedData = removeUselessTimeSeries(
            data.state.allTimeSeries[dataIndex],
            data.state.width[dataIndex],
            state.meanR[dataIndex]);
          state.allTimeSeries[dataIndex] = removedData.newAllTimeSeries;
          state.sampledCoords[dataIndex] = removedData.sampledCoords;
        }
        subject.onNext({ state });
        break;
      }
      case SET_NEWDATA: {
        const { position } = payload;
        const removedData = removeUselessTimeSeries(
          data.state.allTimeSeries[position],
          data.state.width[position],
          state.meanR[position]);
        state.allTimeSeries[position] = removedData.newAllTimeSeries;
        state.sampledCoords[position] = removedData.sampledCoords;
        subject.onNext({ state });
        break;
      }
      case SET_NEWFILTER: {
        const { filterType, position } = payload;
        const { windowSize } = filterType.params;
        state.windowSize[position] = windowSize;

        const allTimeSeries = data.state.allTimeSeries[position];
        const width = data.state.width[position];
        const meanAllTimeSeries = applyMeanFilter(allTimeSeries, width, windowSize);
        subject.onNext({ state });
        break;
      }
      default:
        subject.onNext({ state });
    }
  });
  return subject;
};

export default store;

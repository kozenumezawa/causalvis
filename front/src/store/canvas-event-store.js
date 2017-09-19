import Rx from 'rx';

import { SELECT_CLUSTER } from '../constants/event-constants';

const isClusterContained = (selectedClusterLists, positionIdx, clusterNumber) => {
  if (selectedClusterLists[positionIdx].indexOf(clusterNumber) === -1) {
    return true;
  }
  return false;
};

const store = (intentSubject, filterSubject) => {
  const state = {
    selectedClusterLists: [[], []],
    selectedTimeSeriesLists: [[{}], [{}]],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject).subscribe(([payload, filter]) => {
    switch (payload.type) {
      case SELECT_CLUSTER: {
        const { clusterNumber, positionIdx } = payload;
        // update selectedClusterLists
        if (isClusterContained(state.selectedClusterLists, positionIdx, clusterNumber)) {
          state.selectedClusterLists[positionIdx].push(clusterNumber);
        } else {
          state.selectedClusterLists[positionIdx] = state.selectedClusterLists[positionIdx].filter((containedClusterNumber) => {
            return (containedClusterNumber !== clusterNumber);
          });
        }
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

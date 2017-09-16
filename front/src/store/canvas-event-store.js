import Rx from 'rx';

import { SELECT_CLUSTER } from '../constants/event-constants';

const store = (intentSubject) => {
  const state = {
    selectedClusterLists: [[], []],
  };

  const subject = new Rx.BehaviorSubject({ state });

  intentSubject.subscribe((payload) => {
    switch (payload.type) {
      case SELECT_CLUSTER: {
        const { clusterNumber, positionIdx } = payload;
        // update selectedClusterLists
        if (state.selectedClusterLists[positionIdx].indexOf(clusterNumber) === -1) {
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

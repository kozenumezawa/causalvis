import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, causalSubject, filterSubject) => {
  const state = {
    clusterMatrices: [],
    clusterSampledCoords: [],
    clusterRangeLists: [],
    nClusterLists: [],
    ordering: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, causalSubject, filterSubject).subscribe(([payload, causal, filter]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        if (causal.state.causalMatrices[0] == null) {
          subject.onNext({ state });
          return;
        }

        const dataNames = ['real', 'sim'];
        const fetchPromises = causal.state.causalMatrices.map((causalMatrix, idx) => {
          return fetch('http://localhost:3000/api/v1/clustering', {
            mode: 'cors',
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              causalMatrix: causalMatrix,
              method: 'IRM',
              threshold: 0.7,
              sampledCoords: filter.state.sampledCoords[idx],
              dataName: dataNames[idx],
            }),
          })
            .then((response) => {
              return response.json();
            })
            .then((json) => {
              return json;
            });
        });

        Promise.all(fetchPromises).then((responseJSONS) => {
          responseJSONS.forEach((json, idx) => {
            state.clusterMatrices[idx] = json.clusterMatrix;
            state.clusterSampledCoords[idx] = json.clusterSampledCoords;
            state.nClusterLists[idx] = json.nClusterList;
            state.ordering[idx] = json.ordering;

            // save start and stop index of each cluster
            const clusterRangeList = [];
            json.nClusterList.reduce((prev, current) => {
              const endPixel = prev + current;
              clusterRangeList.push({
                start: prev,
                end: endPixel,
              });
              return endPixel;
            }, 0);
            state.clusterRangeLists[idx] = clusterRangeList;
          });
          subject.onNext({ state });
        });
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

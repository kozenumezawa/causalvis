import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, causalSubject, filterSubject) => {
  const state = {
    clusterMatrix: [],
    clusterSampledCoords: [],
    nClusterList: [],
    ordering: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, causalSubject, filterSubject).subscribe(([payload, causal, filter]) => {
    const causalMatrix = causal.state.causalMatrix;
    if (causalMatrix.length === 0) {
      subject.onNext({ state });
      return;
    }

    window.fetch('http://localhost:3000/api/v1/clustering', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        causalMatrix,
        method: 'IRM',
        threshold: 0.7,
        sampledCoords: filter.state.sampledCoords,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        state.clusterMatrix[0] = json.clusterMatrix;
        state.clusterSampledCoords[0] = json.clusterSampledCoords;
        state.nClusterList[0] = json.nClusterList;
        state.ordering[0] = json.ordering;
        subject.onNext({ state });
      });
  });
  return subject;
};

export default store;

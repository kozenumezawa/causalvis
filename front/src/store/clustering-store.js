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
    switch (payload.type) {
      case FETCH_TIFF:
        if (causal.state.causalMatrix[0] == null) {
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
            causalMatrix: causal.state.causalMatrix[0],
            method: 'IRM',
            threshold: 0.7,
            sampledCoords: filter.state.sampledCoords[0],
            dataName: 'real',
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

            window.fetch('http://localhost:3000/api/v1/clustering', {
              mode: 'cors',
              method: 'POST',
              headers: {
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                causalMatrix: causal.state.causalMatrix[1],
                method: 'IRM',
                threshold: 0.7,
                sampledCoords: filter.state.sampledCoords[1],
                dataName: 'sim',
              }),
            })
              .then((response) => {
                return response.json();
              })
              .then((json) => {
                state.clusterMatrix[1] = json.clusterMatrix;
                state.clusterSampledCoords[1] = json.clusterSampledCoords;
                state.nClusterList[1] = json.nClusterList;
                state.ordering[1] = json.ordering;
                
                subject.onNext({ state });
              });
          });
        break;
      default:
        subject.onNext({ state });
        break;
    }
  });
  return subject;
};

export default store;

import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, filterSubject) => {
  const state = {
    causalMatrices: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject).subscribe(([payload, filter]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        if (filter.state.allTimeSeries[0] == null) {
          subject.onNext({ state });
          return;
        }
        const dataNames = ['real', 'sim'];
        const fetchPromises = filter.state.allTimeSeries.map((allTimeSeries, idx) => {
          return fetch('http://localhost:3000/api/v1/causal', {
            mode: 'cors',
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              allTimeSeries,
              maxLag: 20,
              lagStep: 2,
              method: 'CROSS',
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
          state.causalMatrices = responseJSONS.map((json) => {
            return json.causalMatrix;
          });
          subject.onNext({ state });
        });
        break;
      }
      default:
        subject.onNext({ state });
    }
  });
  return subject;
};

export default store;

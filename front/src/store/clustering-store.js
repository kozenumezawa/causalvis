import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, causalSubject) => {
  const state = {
    clusterMatrix: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, causalSubject).subscribe(([payload, causal]) => {
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
        causalMatrix: causalMatrix,
        method: 'IRM',
        threshold: 0.7,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        state.clusterMatrix = json.clusterMatrix;
        subject.onNext({ state });
      });
  });
  return subject;
};

export default store;

import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, filterSubject, dataSubject) => {
  const state = {
    causalMatrix: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject, dataSubject).subscribe(([payload, filter, data]) => {
    if (filter.state.allTimeSeries[0] == null) {
      subject.onNext({ state });
      return;
    }

    window.fetch('http://localhost:3000/api/v1/causal', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        allTimeSeries: filter.state.allTimeSeries[0],
        maxLag: 20,
        lagStep: 2,
        method: 'CROSS',
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        state.causalMatrix[0] = json.causalMatrix;
        subject.onNext({ state });
      });
  });
  return subject;
};

export default store;

import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const fetchCausal = (allTimeSeries, width) => {
  window.fetch('http://localhost:3000/api/v1/causal', {
    mode: 'cors',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      allTimeSeries: allTimeSeries,
      width: width,
      method: 'CROSS',
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      console.log('json', json);
    });
};

const store = (intentSubject, filterSubject) => {
  const state = {
    causalMatrix: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject).subscribe(([payload, filter]) => {
    if (filter.state.allTimeSeries.length === 0) {
      subject.onNext({ state });
      return;
    }
    state.causalMatrix = fetchCausal(filter.state.allTimeSeries, filter.state.width);
    subject.onNext({ state });
  });
  return subject;
};

export default store;

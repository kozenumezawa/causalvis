import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, causalSubject) => {
  const state = {
    clusterMatrix: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, causalSubject).subscribe(([payload, causal]) => {
    console.log('causalmatrix', causal.state.causalMatrix);
    switch (payload.type) {
      case FETCH_TIFF:
        subject.onNext({ state });
        break;
      default:
        subject.onNext({ state });
        break;
    }
  });
  return subject;
};

export default store;

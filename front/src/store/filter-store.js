import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, dataSubject) => {
  const state = {
    allTimeSeries: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, dataSubject).subscribe(([payload, data]) => {
    state.allTimeSeries = data.state.allTimeSeries;
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

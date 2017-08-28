import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, causalSubject) => {
  const state = {
    test: 'test',
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, causalSubject).subscribe(([payload, data]) => {
    console.log(data.state);
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

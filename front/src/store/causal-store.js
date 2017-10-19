import Rx from 'rx';

import { FETCH_TIFF, SET_NEWDATA } from '../constants/event-constants';
import { DATA_SIM, DATA_WILD, DATA_TRP3 } from '../constants/general-constants';

const store = (intentSubject, filterSubject, modalSubject) => {
  const state = {
    causalMatrices: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject, modalSubject).subscribe(([payload, filter, modal]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        if (filter.state.allTimeSeries[0] == null) {
          subject.onNext({ state });
          return;
        }

        // const { causalMethodParamsList } = modal.state;
        const dataNames = [DATA_TRP3, DATA_SIM];
        const fetchPromises = filter.state.allTimeSeries.map((allTimeSeries, idx) => {
          const causalFetch = fetch(`${API_ENDPOINT}/api/v1/causal`, {
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
            .then(response => response.json())
            .then(json => json);
          return causalFetch;
        });

        Promise.all(fetchPromises).then((responseJSONS) => {
          state.causalMatrices = responseJSONS.map(json => json.causalMatrix);
          subject.onNext({ state });
        });
        break;
      }
      case SET_NEWDATA: {
        const { dataType, position } = payload;
        switch (dataType) {
          case DATA_SIM:
            subject.onNext({ state });
            break;
          case DATA_TRP3:
            subject.onNext({ state });
            break;
          case DATA_WILD:
            subject.onNext({ state });
            break;
          default:
            subject.onNext({ state });
            break;
        }
        break;
      }
      default:
        subject.onNext({ state });
    }
  });
  return subject;
};

export default store;

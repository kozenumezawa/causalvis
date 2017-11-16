import Rx from 'rx';

import { FETCH_TIFF, SET_NEWDATA } from '../constants/event-constants';
import { DATA_SIM, DATA_TRP3 } from '../constants/general-constants';

const store = (intentSubject, filterSubject) => {
  const state = {
    causalMatrices: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject).subscribe(([payload, filter]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        if (filter.state.sampledAllTimeSeries[0] == null) {
          subject.onNext({ state });
          return;
        }

        // const { causalMethodParamsList } = modal.state;
        const dataNames = [DATA_TRP3, DATA_SIM];
        const fetchPromises = filter.state.sampledAllTimeSeries.map((allTimeSeries, idx) => {
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
              windowSize: filter.state.windowSize[idx],
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
        const dataName = dataType;
        window.fetch(`${API_ENDPOINT}/api/v1/causal`, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            allTimeSeries: filter.state.sampledAllTimeSeries[position],
            maxLag: 20,
            lagStep: 2,
            method: 'CROSS',
            dataName,
            windowSize: filter.state.windowSize[position],
          }),
        })
          .then(response => response.json())
          .then((json) => {
            state.causalMatrices[position] = json.causalMatrix;
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

import Rx from 'rx';

import { FETCH_TIFF, SET_NEWDATA } from '../constants/event-constants';
import { DATA_SIM, DATA_TRP3 } from '../constants/general-constants';

const store = (intentSubject, causalSubject, filterSubject) => {
  const state = {
    clusterMatrices: [],
    clusterSampledCoords: [],
    clusterRangeLists: [],
    nClusterLists: [],
    ordering: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, causalSubject, filterSubject).subscribe(([payload, causal, filter]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        if (causal.state.causalMatrices[0] == null) {
          subject.onNext({ state });
          return;
        }

        const dataNames = [DATA_TRP3, DATA_SIM];
        const fetchPromises = causal.state.causalMatrices.map((causalMatrix, idx) => {
          const clusteringFetch = fetch(`${API_ENDPOINT}/api/v1/clustering`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              causalMatrix,
              method: 'IRM',
              threshold: 0.7,
              sampledCoords: filter.state.sampledCoords[idx],
              dataName: dataNames[idx],
              windowSize: filter.state.windowSize[idx],
            }),
          })
            .then(response => response.json())
            .then(json => json);
          return clusteringFetch;
        });

        Promise.all(fetchPromises).then((responseJSONS) => {
          responseJSONS.forEach((json, idx) => {
            state.clusterMatrices[idx] = json.clusterMatrix;
            state.clusterSampledCoords[idx] = json.clusterSampledCoords;
            state.nClusterLists[idx] = json.nClusterList;
            state.ordering[idx] = json.ordering;

            // save start and stop index of each cluster
            const clusterRangeList = [];
            json.nClusterList.reduce((prev, current) => {
              const endPixel = prev + current;
              clusterRangeList.push({
                start: prev,
                end: endPixel,
              });
              return endPixel;
            }, 0);
            state.clusterRangeLists[idx] = clusterRangeList;
          });
          subject.onNext({ state });
        });
        break;
      }
      case SET_NEWDATA: {
        const { dataType, position } = payload;
        const dataName = dataType;
        window.fetch(`${API_ENDPOINT}/api/v1/clustering`, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            causalMatrix: causal.state.causalMatrices[position],
            method: 'IRM',
            threshold: 0.7,
            sampledCoords: filter.state.sampledCoords[position],
            dataName,
            windowSize: filter.state.windowSize[position],
          }),
        })
          .then(response => response.json())
          .then((json) => {
            state.clusterMatrices[position] = json.clusterMatrix;
            state.clusterSampledCoords[position] = json.clusterSampledCoords;
            state.nClusterLists[position] = json.nClusterList;
            state.ordering[position] = json.ordering;

            // save start and stop index of each cluster
            const clusterRangeList = [];
            json.nClusterList.reduce((prev, current) => {
              const endPixel = prev + current;
              clusterRangeList.push({
                start: prev,
                end: endPixel,
              });
              return endPixel;
            }, 0);
            state.clusterRangeLists[position] = clusterRangeList;
            subject.onNext({ state });
          });
        break;
      }
      default:
        subject.onNext({ state });
        break;
    }
  });
  return subject;
};

export default store;

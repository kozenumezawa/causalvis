import Rx from 'rx';

import { FETCH_TIFF, SET_NEWDATA } from '../constants/event-constants';
import { DATA_SIM, DATA_TRP3 } from '../constants/general-constants';

const store = (intentSubject, filterSubject) => {
  const state = {
    corrMatrices: [],
    lagMatrices: [],
    clusterMatrices: [],
    clusterSampledCoords: [],
    clusterRangeLists: [],
    nClusterLists: [],
    ordering: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject).subscribe(([payload, filter]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        if (filter.state.sampledAllTimeSeries[0] == null) {
          subject.onNext({ state });
          return;
        }

        const dataNames = [DATA_TRP3, DATA_SIM];
        const fetchPromises = filter.state.sampledAllTimeSeries.map((allTimeSeries, idx) => {
          const clusteringFetch = fetch(`${API_ENDPOINT}/api/v1/causal-and-clustering`, {
            mode: 'cors',
            method: 'POST',
            headers: {
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              allTimeSeries,
              maxLag: 20,
              lagStep: 1,
              causalMethod: 'CROSS',
              windowSize: filter.state.windowSize[idx],

              clusteringMethod: 'IRM',
              threshold: 0.7,
              sampledCoords: filter.state.sampledCoords[idx],
              dataName: dataNames[idx],
            }),
          })
            .then(response => response.json())
            .then(json => json);
          return clusteringFetch;
        });

        Promise.all(fetchPromises).then((responseJSONS) => {
          responseJSONS.forEach((json, idx) => {
            state.corrMatrices[idx] = json.corrMatrix;
            state.lagMatrices[idx] = json.lagMatrix;
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
            // causalMatrix: causal.state.causalMatrices[position],
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

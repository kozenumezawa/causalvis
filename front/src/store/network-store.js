import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, clusteringSubject) => {
  const state = {
    networks: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, clusteringSubject).subscribe(([payload, clustering]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        const { clusterMatrices, nClusterLists } = clustering.state;

        const networks = nClusterLists.map((nClusterList, dataIdx) => {
          // save start and stop index of each cluster
          const clusterRangeList = [];
          nClusterList.reduce((prev, current) => {
            const endPixel = prev + current;
            clusterRangeList.push({
              start: prev,
              end: endPixel,
            });
            return endPixel;
          }, 0);

          const clusterRangeIdx = new Map(clusterRangeList.map((causalClusterRange, idx) => [causalClusterRange, idx]));

          const nodes = nClusterList.map((nCluster, idx) => {
            return { index: `${idx}` };
          });

          const links = [];
          for (const causalClusterRange of clusterRangeList) {
            const height = causalClusterRange.end - causalClusterRange.start;
            for (const effectClusterRange of clusterRangeList) {
              if (causalClusterRange === effectClusterRange) {
                continue;
              }
              let causalCnt = 0;
              for (let causalIdx = causalClusterRange.start; causalIdx < causalClusterRange.end; causalIdx++) {
                for (let effectIdx = effectClusterRange.start; effectIdx < effectClusterRange.end; effectIdx++) {
                  if (clusterMatrices[dataIdx][causalIdx][effectIdx] === true) {
                    causalCnt++;
                  }
                }
              }
              const width = effectClusterRange.end - effectClusterRange.start;
              const area = width * height;
              if (causalCnt > area * 0.95) {
                links.push({
                  source: clusterRangeIdx.get(causalClusterRange),
                  target: clusterRangeIdx.get(effectClusterRange),
                  intensity: (1 - 0) / (1 - 0.95) * (causalCnt / area - 1) + 1,
                });
              }
            }
          }

          return { nodes, links };
        });

        state.networks = networks;
        subject.onNext({ state });
        break;
      }
      default:
        subject.onNext({ state });
    }
  });

  return subject;
};

export default store;

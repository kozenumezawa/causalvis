import Rx from 'rx';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject, clusteringSubject) => {
  const state = {
    networks: [],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, clusteringSubject).subscribe(([payload, clustering]) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        const { clusterMatrix: clusterMatricies, nClusterList: nClusterLists } = clustering.state;

        const networkPromises = nClusterLists.map((nClusterList, dataIdx) => {
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

          const nodes = nClusterList.map(() => {
            return {};
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
                  if (clusterMatricies[dataIdx][causalIdx][effectIdx] === true) {
                    causalCnt++;
                  }
                }
              }
              const width = effectClusterRange.end - effectClusterRange.start;
              const area = width * height;
              if (causalCnt > area * 0.9) {
                links.push({
                  source: clusterRangeIdx.get(causalClusterRange),
                  target: clusterRangeIdx.get(effectClusterRange),
                  inteinsity: causalCnt / area,
                });
              }
            }
          }

          const simulation = forceSimulation(nodes);
          simulation.force("link", forceLink(links));
          simulation.force("charge", forceManyBody());
          simulation.force("center", forceCenter(200, 200));

          return new Promise((resolve, reject) => {
            simulation.on('end', () => {
              resolve({ nodes, links });
            });
          });
        });

        Promise.all(networkPromises).then((networks) => {
          state.networks = networks;
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

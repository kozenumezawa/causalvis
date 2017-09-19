import Rx from 'rx';
import dataStore from './data-store';
import filterStore from './filter-store';
import causalStore from './causal-store';
import clusteringStore from './clustering-store';
import networkStore from './network-store';
import canvasEventStore from './canvas-event-store';

import modalStore from './modal-store';

import { intentSubject } from '../intents/intent';

const store = () => {
  const dataSubject = dataStore(intentSubject);
  const filterSubject = filterStore(intentSubject, dataSubject);
  const causalSubject = causalStore(intentSubject, filterSubject);
  const clusteringSubject = clusteringStore(intentSubject, causalSubject, filterSubject);
  const networkSubject = networkStore(intentSubject, clusteringSubject);
  const modalSubject = modalStore(intentSubject);
  const canvasEventSubject = canvasEventStore(intentSubject, filterSubject);

  return Rx.Observable.zip(
    dataSubject,
    filterSubject,
    causalSubject,
    clusteringSubject,
    networkSubject,
    modalSubject,
    canvasEventSubject,
    (data, filter, causal, clustering, network, modal, canvasEvent) => {
      return {
        data: data.state,
        filter: filter.state,
        causal: causal.state,
        clustering: clustering.state,
        network: network.state,
        modal: modal.state,
        canvasEvent: canvasEvent.state,
      };
    },
  );
};

export default store;


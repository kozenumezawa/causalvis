import Rx from 'rx';
import dataStore from './data-store';
import filterStore from './filter-store';
import clusteringStore from './clustering-store';
import networkStore from './network-store';
import canvasEventStore from './canvas-event-store';

import modalStore from './modal-store';

import { intentSubject } from '../intents/intent';

const store = () => {
  const modalSubject = modalStore(intentSubject);
  const dataSubject = dataStore(intentSubject);
  const filterSubject = filterStore(intentSubject, dataSubject);
  const clusteringSubject = clusteringStore(intentSubject, filterSubject);
  const networkSubject = networkStore(intentSubject, clusteringSubject);
  const canvasEventSubject =
    canvasEventStore(intentSubject, dataSubject, filterSubject, clusteringSubject);

  return Rx.Observable.zip(
    dataSubject,
    filterSubject,
    clusteringSubject,
    networkSubject,
    modalSubject,
    canvasEventSubject,
    (data, filter, clustering, network, modal, canvasEvent) => {
      const states = {
        data: data.state,
        filter: filter.state,
        clustering: clustering.state,
        network: network.state,
        modal: modal.state,
        canvasEvent: canvasEvent.state,
      };
      return states;
    },
  );
};

export default store;


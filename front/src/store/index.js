import Rx from 'rx';
import dataStore from './data-store';
import filterStore from './filter-store';
import causalStore from './causal-store';
import clusteringStore from './clustering-store';
import { intentSubject } from '../intents/intent';

const store = () => {
  const dataSubject = dataStore(intentSubject);
  const filterSubject = filterStore(intentSubject, dataSubject);
  const causalSubject = causalStore(intentSubject, filterSubject);
  const clusteringSubject = clusteringStore(intentSubject, causalSubject, filterSubject);


  return Rx.Observable.zip(
    dataSubject,
    filterSubject,
    causalSubject,
    clusteringSubject,
    (data, filter, causal, clustering) => {
      return {
        data: data.state,
        filter: filter.state,
        causal: causal.state,
        clustering: clustering.state,
      };
    },
  );
};

export default store;


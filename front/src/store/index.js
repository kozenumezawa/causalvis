import Rx from 'rx';
import dataStore from './data-store';
import causalStore from './causal-store';
import filterStore from './filter-store';
import { intentSubject } from '../intents/data';

const store = () => {
  const dataSubject = dataStore(intentSubject);
  const filterSubject = filterStore(intentSubject, dataSubject);
  const causalSubject = causalStore(intentSubject, filterSubject);


  return Rx.Observable.zip(
    dataSubject,
    filterSubject,
    causalSubject,
    (data, filter, causal) => {
      return {
        data: data.state,
        filter: filter.state,
        causal: causal.state,
      };
    },
  );
};

export default store;


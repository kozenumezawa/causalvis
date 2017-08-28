import Rx from 'rx';
import dataStore from './data-store';
import causalStore from './causal-store';
import { intentSubject } from '../intents/data';

const store = () => {
  const dataSubject = dataStore(intentSubject);
  const causalSubject = causalStore(intentSubject, dataSubject);

  return Rx.Observable.zip(
    dataSubject,
    causalSubject,
    (data, causal) => {
      return {
        data: data.state,
        causal: causal.state,
      };
    },
  );
};

export default store;


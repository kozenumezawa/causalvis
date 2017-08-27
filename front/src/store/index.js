import Rx from 'rx';
import dataStore from './data-store';
import { intentSubject } from '../intents/data';

const store = () => {
  const dataSubject = dataStore(intentSubject);

  return Rx.Observable.zip(
    dataSubject,
    (data) => {
      return {
        data: data.state,
      };
    },
  );
};

export default store;


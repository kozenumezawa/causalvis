import Rx from 'rx';

import { OPEN_MODAL, CLOSE_MODAL } from '../constants/event-constants';

const getInitialParamsState = (state) => {
  const stepsPerLagList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const maxLagList = stepsPerLagList.map((stepsPerLag) => {
    return stepsPerLag * 10;
  });
  const EList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const tauList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const kList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const mList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return state.causalMethodParamsList.map(() => {
    return {
      cross: {
        stepsPerLag: 1,
        maxLag: 20,
        stepsPerLagList,
        maxLagList,
      },
      ccm: {
        E: 2,
        tau: 2,
        EList,
        tauList,
      },
      granger: {
        k: 1,
        m: 1,
        kList,
        mList,
      },
    };
  });
};

const store = (intentSubject) => {
  const state = {
    openModal: false,
    causalMethodParamsList: [{}, {}],
  };
  state.causalMethodParamsList = getInitialParamsState(state);

  const subject = new Rx.BehaviorSubject({ state });

  intentSubject.subscribe((payload) => {
    switch (payload.type) {
      case OPEN_MODAL: {
        state.openModal = true;
        subject.onNext({ state });
        break;
      }
      case CLOSE_MODAL: {
        state.openModal = false;
        subject.onNext({ state });
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

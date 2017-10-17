import Rx from 'rx';

import {
  FETCH_TIFF,
  DATA_INIT,
  OPEN_MODAL,
  CLOSE_MODAL,
  SELECT_CLUSTER,
  SELECT_ONE_POINT,
  CHECK_CLICK,
  SET_NEWDATA,
} from '../constants/event-constants';

export const intentSubject = new Rx.BehaviorSubject({ type: DATA_INIT });

export const loadTiff = (dataName, legendName) => {
  intentSubject.onNext({
    type: FETCH_TIFF,
    dataName,
    legendName,
  });
};

export const openModal = () => {
  intentSubject.onNext({
    type: OPEN_MODAL,
  });
};

export const closeModal = () => {
  intentSubject.onNext({
    type: CLOSE_MODAL,
  });
};

export const selectCluster = (clusterNumber, positionIdx) => {
  intentSubject.onNext({
    type: SELECT_CLUSTER,
    clusterNumber,
    positionIdx,
  });
};

export const selectOnePoint = (x, y, positionIdx) => {
  intentSubject.onNext({
    type: SELECT_ONE_POINT,
    x,
    y,
    positionIdx,
  });
};

export const checkClick = () => {
  intentSubject.onNext({
    type: CHECK_CLICK,
  });
};

export const setNewData = (dataType, position) => {
  intentSubject.onNext({
    type: SET_NEWDATA,
    dataType,
    position,
  });
};

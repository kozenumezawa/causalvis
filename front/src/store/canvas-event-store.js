import Rx from 'rx';

import { SELECT_CLUSTER } from '../constants/event-constants';
import * as drawingTool from '../utils/drawing-tool';

const isClusterContained = (selectedClusterLists, positionIdx, clusterNumber) => {
  if (selectedClusterLists[positionIdx].indexOf(clusterNumber) === -1) {
    return false;
  }
  return true;
};

const getArrayAverage = (arr) => {
  const sum = arr.reduce((prev, current) => {
    return prev + current;
  });
  return sum / arr.length;
};

const get2DArrayAverage = (arr) => {
  const arr2D = [];
  for (let i = 0; i < arr[0].length; i++) {
    const arrTemp = [];
    for (let j = 0; j < arr.length; j++) {
      arrTemp.push(arr[j][i]);
    }
    arr2D.push(getArrayAverage(arrTemp));
  }
  return arr2D;
};

const store = (intentSubject, dataSubject, clusteringSubject) => {
  const state = {
    selectedClusterLists: [[], []],
    selectedTimeSeriesLists: [[], []],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, dataSubject, clusteringSubject).subscribe(([payload, data, clustering]) => {
    switch (payload.type) {
      case SELECT_CLUSTER: {
        const { clusterNumber, positionIdx } = payload;
        // update selectedClusterLists
        if (isClusterContained(state.selectedClusterLists, positionIdx, clusterNumber)) {
          state.selectedClusterLists[positionIdx] = state.selectedClusterLists[positionIdx].filter((containedClusterNumber) => {
            return (containedClusterNumber !== clusterNumber);
          });

          state.selectedTimeSeriesLists[positionIdx] = state.selectedTimeSeriesLists[positionIdx].filter((selectedTimeSeries) => {
            return (selectedTimeSeries.clusterNumber !== clusterNumber);
          });
        } else {
          state.selectedClusterLists[positionIdx].push(clusterNumber);

          // update selectedTimeSeries
          const allTimeSeries = data.state.allTimeSeries[positionIdx];
          const clusterRangeList = clustering.state.clusterRangeLists[positionIdx];
          const clusterSampledCoords = clustering.state.clusterSampledCoords[positionIdx];
          const nClusterList = clustering.state.nClusterLists[positionIdx];

          const color = drawingTool.getColorCategory(nClusterList.length);

          const selectedTimeSeries = [];
          for (let dataIdx = clusterRangeList[clusterNumber].start; dataIdx < clusterRangeList[clusterNumber].end; dataIdx++) {
            selectedTimeSeries.push(allTimeSeries[clusterSampledCoords[dataIdx].idx]);
          }

          const averageTimeSeries = get2DArrayAverage(selectedTimeSeries);
          state.selectedTimeSeriesLists[positionIdx].push({
            clusterNumber: clusterNumber,
            color: color[clusterNumber],
            data: averageTimeSeries.map((value, idx) => {
              return {
                x: idx,
                y: value,
              };
            }),
          });
        }

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

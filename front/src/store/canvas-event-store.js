import Rx from 'rx';

import { SELECT_CLUSTER, SELECT_ONE_POINT } from '../constants/event-constants';
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

const store = (intentSubject, dataSubject, filterSubject, clusteringSubject) => {
  const state = {
    selectedClusterLists: [[], []],
    selectedTimeSeriesLists: [{ averageData: [], rawData: [] }, { averageData: [], rawData: [] }],
    pointToAllCausals: [{ pointRowIdx: -1, data: [] }, { pointRowIdx: -1, data: [] }],
    pointToNearCausals: [{ pointRowIdx: -1, data: [] }, { pointRowIdx: -1, data: [] }],
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, dataSubject, filterSubject, clusteringSubject)
    .subscribe(([payload, data, filter, clustering]) => {
      switch (payload.type) {
        case SELECT_CLUSTER: {
          const { clusterNumber, positionIdx } = payload;
          // update selectedClusterLists
          if (isClusterContained(state.selectedClusterLists, positionIdx, clusterNumber)) {
            // delete a clicked cluster from selectedClusterLists and selectedClusterLists
            const deleteIdx = state.selectedClusterLists[positionIdx].indexOf(clusterNumber);

            state.selectedClusterLists[positionIdx].splice(deleteIdx, 1);
            state.selectedTimeSeriesLists[positionIdx].averageData.splice(deleteIdx, 1);
            state.selectedTimeSeriesLists[positionIdx].rawData.splice(deleteIdx, 1);
          } else {
            state.selectedClusterLists[positionIdx].push(clusterNumber);
            // update selectedTimeSeries
            const allTimeSeries = data.state.allTimeSeries[positionIdx];
            const clusterRangeList = clustering.state.clusterRangeLists[positionIdx];
            const clusterSampledCoords = clustering.state.clusterSampledCoords[positionIdx];
            const nClusterList = clustering.state.nClusterLists[positionIdx];

            const color = drawingTool.getColorCategory(nClusterList.length);

            const selectedTimeSeries = [];
            for (let rowIdx = clusterRangeList[clusterNumber].start;
              rowIdx < clusterRangeList[clusterNumber].end; rowIdx++) {
              selectedTimeSeries.push(allTimeSeries[clusterSampledCoords[rowIdx].idx]);
            }

            const averageTimeSeries = get2DArrayAverage(selectedTimeSeries);
            state.selectedTimeSeriesLists[positionIdx].averageData.push({
              label: clusterNumber,
              color: color[clusterNumber],
              data: averageTimeSeries.map((value, x) => {
                return {
                  x: x,
                  y: value,
                };
              }),
            });

            state.selectedTimeSeriesLists[positionIdx].rawData.push(
              selectedTimeSeries.map((timeSeries, rowIdx) => {
                return {
                  label: `${clusterNumber}_${rowIdx}`,
                  color: color[clusterNumber],
                  data: timeSeries.map((value, x) => {
                    return {
                      x: x,
                      y: value,
                    };
                  }),
                };
              }));
          }

          subject.onNext({ state });
          break;
        }
        case SELECT_ONE_POINT: {
          const { x, y, positionIdx } = payload;
          const meanR = filter.state.meanR[positionIdx];

          // set nearCoordsList
          const nearCoordsList = [];
          const pixelInterval = 3;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              nearCoordsList.push({
                x: x + j * pixelInterval,
                y: y + i * pixelInterval,
                rowIdx: -1,
              });
            }
          }

          // search each row index from the coordinate
          clustering.state.clusterSampledCoords[positionIdx].forEach((sampledCoord, rowIdx) => {
            for (const obj of nearCoordsList) {
              if (obj.x >= sampledCoord.x - meanR
                && obj.x <= sampledCoord.x + meanR && obj.y >= sampledCoord.y - meanR
                && obj.y <= sampledCoord.y + meanR) {
                obj.rowIdx = rowIdx;
              }
            }
          });

          // console.log(nearCoordsList);
          const clusterMatrix = clustering.state.clusterMatrices[positionIdx];
          const centerRowIdx = nearCoordsList[4].rowIdx;
          state.pointToAllCausals[positionIdx] = {
            pointRowIdx: centerRowIdx,
            data: clusterMatrix[centerRowIdx],
          };

          const getNearRelation = () => {
            const relation = nearCoordsList.map((nearCoords) => {
              const targetRowIdx = nearCoords.rowIdx;
              return {
                x: nearCoords.x,
                y: nearCoords.y,
                rowIdx: nearCoords.rowIdx,
                fromCenter: clusterMatrix[centerRowIdx][targetRowIdx],
                toCenter: clusterMatrix[targetRowIdx][centerRowIdx],
              };
            });
            return relation;
          };

          state.pointToNearCausals[positionIdx] = {
            pointRowIdx: centerRowIdx,
            data: getNearRelation(),
          };
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

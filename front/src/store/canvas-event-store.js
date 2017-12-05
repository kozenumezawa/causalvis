import Rx from 'rx';

import { SELECT_CLUSTER, SELECT_ONE_POINT, SET_NEWDATA } from '../constants/event-constants';
import * as drawingTool from '../utils/drawing-tool';

const isClusterContained = (selectedClusterLists, positionIdx, clusterNumber) => {
  if (selectedClusterLists[positionIdx].indexOf(clusterNumber) === -1) {
    return false;
  }
  return true;
};

const getArrayAverage = (arr) => {
  const sum = arr.reduce((prev, current) => prev + current);
  return sum / arr.length;
};

const get2DArrayAverage = (arr) => {
  const arr2D = [];
  for (let i = 0; i < arr[0].length; i += 1) {
    const arrTemp = [];
    for (let j = 0; j < arr.length; j += 1) {
      arrTemp.push(arr[j][i]);
    }
    arr2D.push(getArrayAverage(arrTemp));
  }
  return arr2D;
};

const isOutside = (rowIdx) => {
  if (rowIdx === -1) {
    return true;
  }
  return false;
};

const store = (intentSubject, dataSubject, filterSubject, clusteringSubject) => {
  const state = {
    selectedClusterLists: [[], []],
    selectedTimeSeriesLists: [{ averageData: [], rawData: [] }, { averageData: [], rawData: [] }],
    pointToAllCausals: [{ pointRowIdx: -1, lagLists: [] }, { pointRowIdx: -1, lagLists: [] }],
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

            const color = drawingTool.getBlackBodyColormap(nClusterList.length);

            const selectedTimeSeries = [];
            for (let rowIdx = clusterRangeList[clusterNumber].start;
              rowIdx < clusterRangeList[clusterNumber].end; rowIdx += 1) {
              selectedTimeSeries.push(allTimeSeries[clusterSampledCoords[rowIdx].idx]);
            }

            const averageTimeSeries = get2DArrayAverage(selectedTimeSeries);
            state.selectedTimeSeriesLists[positionIdx].averageData.push({
              label: clusterNumber,
              color: color[clusterNumber],
              data: averageTimeSeries.map((value, x) => {
                const oneData = {
                  x,
                  y: value,
                };
                return oneData;
              }),
            });

            state.selectedTimeSeriesLists[positionIdx].rawData.push(
              selectedTimeSeries.map((timeSeries, rowIdx) => {
                const lineData = {
                  label: `${clusterNumber}_${rowIdx}`,
                  color: color[clusterNumber],
                  data: timeSeries.map((value, x) => {
                    const oneData = {
                      x,
                      y: value,
                    };
                    return oneData;
                  }),
                };
                return lineData;
              }));
          }

          subject.onNext({ state });
          break;
        }
        case SELECT_ONE_POINT: {
          const { x, y, positionIdx } = payload;
          const meanR = filter.state.meanR[positionIdx];
          const pixelInterval = filter.state.windowSize[positionIdx];

          // set nearCoordsList
          const nearCoordsList = [];
          for (let i = -2; i <= 2; i += 1) {
            for (let j = -2; j <= 2; j += 1) {
              nearCoordsList.push({
                x: x + (j * pixelInterval),
                y: y + (i * pixelInterval),
                rowIdx: -1,
              });
            }
          }
          // search each row index from the coordinate
          clustering.state.clusterSampledCoords[positionIdx].forEach((sampledCoord, rowIdx) => {
            nearCoordsList.forEach((obj) => {
              if (obj.x >= sampledCoord.x - meanR
                && obj.x <= sampledCoord.x + meanR && obj.y >= sampledCoord.y - meanR
                && obj.y <= sampledCoord.y + meanR) {
                const targetObject = obj;
                targetObject.rowIdx = rowIdx;
              }
            });
          });

          const clusterMatrix = clustering.state.clusterMatrices[positionIdx];
          // const centerRowIdx = nearCoordsList[4].rowIdx;
          const centerRowIdx = nearCoordsList[12].rowIdx;

          if (isOutside(centerRowIdx)) {
            subject.onNext({ state });
            break;
          }

          // calculate the lag between selected point (= centerRowIdx) and other points
          const lagMatrix = clustering.state.lagMatrices[positionIdx];
          const lagLists = clusterMatrix[centerRowIdx].map((relation, colIdx) => {
            // search row(cause)
            if (clusterMatrix[centerRowIdx][colIdx] === true) {
              return lagMatrix[centerRowIdx][colIdx];
            }
            // search col(effect)
            if (clusterMatrix[colIdx][centerRowIdx] === true) {
              return -lagMatrix[colIdx][centerRowIdx];
            }
            return false;
          });

          state.pointToAllCausals[positionIdx] = {
            pointRowIdx: centerRowIdx,
            lagLists,
          };

          const nearRelation = nearCoordsList.map((nearCoords) => {
            const targetRowIdx = nearCoords.rowIdx;
            if (isOutside(targetRowIdx)) {
              return {
                x: nearCoords.x,
                y: nearCoords.y,
                rowIdx: nearCoords.rowIdx,
                fromCenter: false,
                toCenter: false,
              };
            }
            return {
              x: nearCoords.x,
              y: nearCoords.y,
              rowIdx: nearCoords.rowIdx,
              fromCenter: clusterMatrix[centerRowIdx][targetRowIdx],
              toCenter: clusterMatrix[targetRowIdx][centerRowIdx],
              lagFromCenter: lagMatrix[centerRowIdx][targetRowIdx],
              lagToCenter: -lagMatrix[targetRowIdx][centerRowIdx],
            };
          });

          state.pointToNearCausals[positionIdx] = {
            pointRowIdx: centerRowIdx,
            data: nearRelation,
          };
          subject.onNext({ state });
          break;
        }
        case SET_NEWDATA: {
          const { position } = payload;
          state.selectedClusterLists[position] = [];
          state.selectedTimeSeriesLists[position] = { averageData: [], rawData: [] };
          state.pointToAllCausals[position] = { pointRowIdx: -1, lagLists: [] };
          state.pointToNearCausals[position] = { pointRowIdx: -1, data: [] };
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

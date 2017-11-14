import Rx from 'rx';

import { FETCH_TIFF, SET_NEWDATA } from '../constants/event-constants';
import { createAllTimeSeriesFromTiff } from '../utils/store-utils';
import { DATA_SIM, DATA_TRP3, DATA_WILD, DATA_TRP3_RAW } from '../constants/general-constants';

const store = (intentSubject) => {
  const state = {
    allTiffList: new Array(2),
    dataType: new Array(2),
    legendTiff: new Array(2),
    allTimeSeries: new Array(2),
    width: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  intentSubject.subscribe((payload) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        state.dataType = [DATA_TRP3, DATA_SIM];
        const trp3Fetch = fetch(payload.dataName)
          .then((response) => {
            response.arrayBuffer().then((buffer) => {
              const allTiffList = [];
              const tiff = new Tiff({ buffer });
              const tiffLen = tiff.countDirectory();
              for (let i = 0; i < tiffLen; i += 1) {
                tiff.setDirectory(i);
                const canvas = tiff.toCanvas();
                allTiffList.push(canvas);
              }

              window.fetch(payload.legendName)
                .then(legendResponse => legendResponse)
                .then((legendRes) => {
                  legendRes.arrayBuffer().then((legendBuffer) => {
                    const legTiff = new Tiff({ buffer: legendBuffer });
                    legTiff.setDirectory(0);
                    const legendTiff = legTiff.toCanvas();

                    state.allTiffList[0] = allTiffList;
                    state.legendTiff[0] = legendTiff;
                    state.allTimeSeries[0] = createAllTimeSeriesFromTiff(null, allTiffList);
                    state.width[0] = state.allTiffList[0][0].width;
                  });
                });
            });
          });
        const simFetch = fetch('NagumoInterpolate.json')
          .then(nagumoResponse => nagumoResponse.json())
          .then((json) => {
            state.allTimeSeries[1] = json.allTimeSeries;
            state.width[1] = json.width;
          });

        const fetchPromises = [trp3Fetch, simFetch];
        Promise.all(fetchPromises).then(() => {
          subject.onNext({ state });
        });
        break;
      }
      case SET_NEWDATA: {
        const { dataType, position } = payload;
        state.dataType[position] = dataType;
        switch (dataType) {
          case DATA_SIM:
            window.fetch('NagumoInterpolate.json')
              .then(nagumoResponse => nagumoResponse.json())
              .then((json) => {
                state.allTimeSeries[position] = json.allTimeSeries;
                state.width[position] = json.width;
                subject.onNext({ state });
              });
            break;
          case DATA_TRP3:
            window.fetch('trp-3-masked8b_color_mean-sub.tif')
              .then((response) => {
                response.arrayBuffer().then((buffer) => {
                  const allTiffList = [];
                  const tiff = new Tiff({ buffer });
                  const tiffLen = tiff.countDirectory();
                  for (let i = 0; i < tiffLen; i += 1) {
                    tiff.setDirectory(i);
                    const canvas = tiff.toCanvas();
                    allTiffList.push(canvas);
                  }

                  window.fetch('2E2_GFB.tif')
                    .then(legendResponse => legendResponse)
                    .then((legendRes) => {
                      legendRes.arrayBuffer().then((legendBuffer) => {
                        const legTiff = new Tiff({ buffer: legendBuffer });
                        legTiff.setDirectory(0);
                        const legendTiff = legTiff.toCanvas();

                        state.allTiffList[position] = allTiffList;
                        state.legendTiff[position] = legendTiff;
                        state.allTimeSeries[position] =
                          createAllTimeSeriesFromTiff(state.legendTiff[position], state.allTiffList[position]);
                        state.width[position] = state.allTiffList[position][0].width;
                        subject.onNext({ state });
                      });
                    });
                });
              });
            break;
          case DATA_WILD:
            window.fetch('GFBratio-mask-64-255_mean-sub.tif')
              .then((response) => {
                response.arrayBuffer().then((buffer) => {
                  const allTiffList = [];
                  const tiff = new Tiff({ buffer });
                  const tiffLen = tiff.countDirectory();
                  for (let i = 0; i < tiffLen; i += 1) {
                    tiff.setDirectory(i);
                    const canvas = tiff.toCanvas();
                    allTiffList.push(canvas);
                  }
                  window.fetch('2E2_GFB.tif')
                    .then(legendResponse => legendResponse)
                    .then((legendRes) => {
                      legendRes.arrayBuffer().then((legendBuffer) => {
                        const legTiff = new Tiff({ buffer: legendBuffer });
                        legTiff.setDirectory(0);
                        const legendTiff = legTiff.toCanvas();

                        state.allTiffList[position] = allTiffList;
                        state.legendTiff[position] = legendTiff;
                        state.allTimeSeries[position] =
                          createAllTimeSeriesFromTiff(state.legendTiff[position], state.allTiffList[position]);
                        state.width[position] = state.allTiffList[position][0].width;
                        subject.onNext({ state });
                      });
                    });
                });
              });

            break;
          case DATA_TRP3_RAW:
            window.fetch('trp3-original-sub-color.tif')
              .then((response) => {
                response.arrayBuffer().then((buffer) => {
                  const allTiffList = [];
                  const tiff = new Tiff({ buffer });
                  const tiffLen = tiff.countDirectory();
                  for (let i = 0; i < tiffLen; i += 1) {
                    tiff.setDirectory(i);
                    const canvas = tiff.toCanvas();
                    allTiffList.push(canvas);
                  }
                  window.fetch('2E2_GFB.tif')
                    .then(legendResponse => legendResponse)
                    .then((legendRes) => {
                      legendRes.arrayBuffer().then((legendBuffer) => {
                        const legTiff = new Tiff({ buffer: legendBuffer });
                        legTiff.setDirectory(0);
                        const legendTiff = legTiff.toCanvas();

                        state.allTiffList[position] = allTiffList;
                        state.legendTiff[position] = legendTiff;
                        state.allTimeSeries[position] =
                          createAllTimeSeriesFromTiff(state.legendTiff[position], state.allTiffList[position]);
                        state.width[position] = state.allTiffList[position][0].width;
                        subject.onNext({ state });
                      });
                    });
                });
              });
            break;
          default:
            subject.onNext({ state });
            break;
        }
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

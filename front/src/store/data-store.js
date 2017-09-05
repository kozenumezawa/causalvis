import Rx from 'rx';

import { FETCH_TIFF } from '../constants/event-constants';
import { createAllTimeSeriesFromTiff } from '../utils/store-utils';

const store = (intentSubject) => {
  const state = {
    allTiffList: new Array(2),
    legendTiff: new Array(2),
    allTimeSeries: new Array(2),
    width: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  intentSubject.subscribe((payload) => {
    switch (payload.type) {
      case FETCH_TIFF: {
        window.fetch(payload.dataName)
          .then((response) => {
            response.arrayBuffer().then((buffer) => {
              const allTiffList = [];
              const tiff = new Tiff({ buffer });
              let tiffLen = tiff.countDirectory();
              tiffLen = tiff.countDirectory() - 100;
              for (let i = 50; i < tiffLen; i++) {
                tiff.setDirectory(i);
                const canvas = tiff.toCanvas();
                allTiffList.push(canvas);
              }

              window.fetch(payload.legendName)
                .then((response) => {
                  return response;
                })
                .then((response) => {
                  response.arrayBuffer().then((buffer) => {
                    const tiff = new Tiff({ buffer });
                    tiff.setDirectory(0);
                    const legendTiff = tiff.toCanvas();

                    state.allTiffList[0] = allTiffList;
                    state.legendTiff[0] = legendTiff;
                    state.allTimeSeries[0] = createAllTimeSeriesFromTiff(state.legendTiff[0], state.allTiffList[0]);
                    state.width[0] = state.allTiffList[0][0].width;

                    window.fetch('NagumoInterpolate.json')
                      .then((response) => {
                        return response.json();
                      })
                      .then((json) => {
                        state.allTimeSeries[1] = json.allTimeSeries;
                        state.width[1] = json.width;

                        subject.onNext({ state });
                      });
                  });
                });
            });
          });
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

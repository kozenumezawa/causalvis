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
              const tiffLen = tiff.countDirectory();
              for (let i = 0; i < tiffLen; i += 1) {
                tiff.setDirectory(i);
                const canvas = tiff.toCanvas();
                allTiffList.push(canvas);
              }

              window.fetch(payload.legendName)
                .then((legendResponse) => {
                  return legendResponse;
                })
                .then((legendRes) => {
                  legendRes.arrayBuffer().then((legendBuffer) => {
                    const legTiff = new Tiff({ buffer: legendBuffer });
                    legTiff.setDirectory(0);
                    const legendTiff = legTiff.toCanvas();

                    state.allTiffList[0] = allTiffList;
                    state.legendTiff[0] = legendTiff;
                    state.allTimeSeries[0] = createAllTimeSeriesFromTiff(state.legendTiff[0], state.allTiffList[0]);
                    state.width[0] = state.allTiffList[0][0].width;

                    window.fetch('NagumoInterpolate.json')
                      .then((nagumoResponse) => {
                        return nagumoResponse.json();
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

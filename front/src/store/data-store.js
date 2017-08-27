import Rx from 'rx';
import { FETCH_TIFF } from '../constants/event-constants';

const store = (intentSubject) => {
  const state = {
    allTiffList: [],
    legendTiff: null,
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

                    state.allTiffList = allTiffList;
                    state.legendTiff = legendTiff;
                    subject.onNext({ state });
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

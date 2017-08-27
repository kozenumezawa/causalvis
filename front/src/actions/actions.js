import Dispatcher from '../dispatcher/dispatcher';
import { LOAD_TIFF } from '../constants/event-constants';

export default {
  loadTiff: (status) => {
    Dispatcher.dispatch({
      actionType: LOAD_TIFF,
      isLoading: status,
    });
  },

  fetchTiff: (legendName, dataName) => {
    window.fetch(dataName)
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

          window.fetch(legendName)
            .then((response) => {
              // dispatch(loadTiff(false));
              return response;
            })
            .then((response) => {
              response.arrayBuffer().then((buffer) => {
                const tiff = new Tiff({ buffer });
                tiff.setDirectory(0);
                const legendTiff = tiff.toCanvas();
                Dispatcher.dispatch({
                  actionType: LOAD_TIFF,
                  legendTiff,
                  allTiffList,
                });
              });
            });
        });
      });
  },
};


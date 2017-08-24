import Dispatcher from '../dispatcher/dispatcher';
import eventConstants from '../constants/event-constants';

let textId = 1;

export default {
  loadTiff: (status) => {
    Dispatcher.dispatch({
      actionType: eventConstants.LOAD_TIFF,
      isLoading: status,
    });
  },

  addText: (newText) => {
    textId += 1;
    Dispatcher.dispatch({
      actionType: eventConstants.ADD_TEXT,
      id: textId,
      text: newText,
    });
  },
};

//
// export const fetchTiff = (tiffName) => {
//   return (dispatch) => {
//     dispatch(loadTiff(true));
//
//     fetch(tiffName)
//       .then((response) => {
//         dispatch(loadTiff(false));
//         return response;
//       })
//       .then((response) => {
//         response.arrayBuffer().then((buffer) => {
//           const tiff = new Tiff({ buffer: buffer });
//           for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
//             tiff.setDirectory(i);
//             const canvas = tiff.toCanvas();
//             console.log(canvas);
//           }
//         });
//       });
//   };
// }

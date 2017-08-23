export const ADD_TEXT = 'ADD_TEXT';
export const LOAD_TIFF = 'LOAD_TIFF';

export const loadTiff = (status) => {
  return {
    type: LOAD_TIFF,
    isLoading: status,
  };
};

let textId = 1;

export function addText(newText) {
  textId += 1;
  return {
    type: ADD_TEXT,
    id: textId,
    text: newText,
  };
}

export const fetchTiff = (tiffName) => {
  return (dispatch) => {
    dispatch(loadTiff(true));

    fetch(tiffName)
      .then((response) => {
        dispatch(loadTiff(false));
        return response;
      })
      .then((response) => {
        response.arrayBuffer().then((buffer) => {
          const tiff = new Tiff({ buffer: buffer });
          for (let i = 0, len = tiff.countDirectory(); i < len; i++) {
            tiff.setDirectory(i);
            const canvas = tiff.toCanvas();
            console.log(canvas);
          }
        });
      });
  };
}

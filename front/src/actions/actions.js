export const ADD_TEXT = 'ADD_TEXT';
let textId = 1;

export function addText(newText) {
  textId += 1;
  return {
    type: ADD_TEXT,
    id: textId,
    text: newText,
  };
}

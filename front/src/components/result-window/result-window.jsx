import React from 'react';

import { Segment, Button} from 'semantic-ui-react';

export default class ResultWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  onAddBtnClicked() {
    const text = 'test';
    this.props.addText(text);
  }

  render() {
    return (
      <Segment style={{ height: 400 }}>
        <input type="text" />
        <br />
        <button onClick={() => this.onAddBtnClicked()}>
          Add
        </button>
        <ul>
          {
            this.props.storedText.map((obj) => {
              return (
                <li key={obj.id}>
                  { obj.text }
                </li>
              );
            })
          }
        </ul>
        <Button>Hello</Button>
      </Segment>
    );
  }
}

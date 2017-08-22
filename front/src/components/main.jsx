import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { addText } from '../actions';

class Main extends React.Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.onAddBtnClicked = this.onAddBtnClicked.bind(this);
  // }

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact path="/"
            render={() => (
              <div>
                <input type="text" ref="input" />
                <br />
                <button onClick={(e) => this.onAddBtnClicked(e)}>
                  Add
                </button>
                <ul>
                  {
                    this.props.state.storedText.map((obj) => {
                      return (
                        <li key={obj.id}>
                          { obj.text }
                        </li>
                      );
                    })
                  }
                </ul>
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }

  onAddBtnClicked(e) {
    const text = "test";
    this.props.dispatch(addText(text));
  }
}

const selector = (state) => {
  console.log(state.storedText);
  return {
    state: state,
  };
};

export default connect(selector)(Main);


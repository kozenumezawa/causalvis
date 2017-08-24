import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Sidebar, Segment } from 'semantic-ui-react';

import { addText, fetchTiff } from '../actions/actions';

import SideMenu from './side-bar/side-menu.jsx';
import ControlWindow from './control-window/control-window.jsx';
import ResultWindow from './result-window/result-window.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchData('2E2_GFB.tif');
  }

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <div>
                <Sidebar.Pushable as={Segment}>
                  <SideMenu />

                  <Sidebar.Pusher>
                    <ControlWindow />

                    <ResultWindow
                      storedText={this.props.storedText}
                      addText={this.props.addText}
                    />
                  </Sidebar.Pusher>
                </Sidebar.Pushable>
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }
}

const selector = (state) => {
  return {
    storedText: state.storedText,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchData: (tiffName) => dispatch(fetchTiff(tiffName)),
  addText: (text) => dispatch(addText(text)),
});

export default connect(selector, mapDispatchToProps)(Main);


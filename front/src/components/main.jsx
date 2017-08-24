import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Sidebar, Segment } from 'semantic-ui-react';

import Store from '../stores/store';
import Actions from '../actions/actions';

import SideMenu from './side-bar/side-menu.jsx';
import ControlWindow from './control-window/control-window.jsx';
import ResultWindow from './result-window/result-window.jsx';

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = Store.getAllState();
    Actions.fetchTiff('2E2_GFB.tif', 'trp-3-masked8b_color_mean.tif');
  }

  componentDidMount() {
    Store.addChangeListener(this.onChange.bind(this));
  }

  onChange() {
    this.setState(Store.getAllState());
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
                      addText={Actions.addText}
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

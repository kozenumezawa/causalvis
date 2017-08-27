import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Sidebar, Segment } from 'semantic-ui-react';

import { loadTiff } from '../intents/data';

import SideMenu from './side-bar/side-menu.jsx';
import ControlWindow from './control-window/control-window.jsx';
import ResultWindow from './result-window/result-window.jsx';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.subscription = this.props.store.subscribe((state) => {
      this.setState(state);
    });
  }

  componentDidMount() {
    loadTiff('trp-3-masked8b_color_mean.tif', '2E2_GFB.tif');
  }

  componentWillUnmount() {
    this.subscription.dispose();
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

                    <ResultWindow />
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

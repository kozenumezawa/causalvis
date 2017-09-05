import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Sidebar, Segment } from 'semantic-ui-react';

import { loadTiff } from '../intents/intent';

import SideMenu from './side-bar/side-menu.jsx';
import ControlWindow from './control-window/control-window.jsx';
import ResultWindow from './result-window/result-window.jsx';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    console.log(API_ENDPOINT);
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

                    <ResultWindow
                      allTiffList={this.state.data.allTiffList}
                      width={this.state.data.width}
                      allTimeSeries={this.state.data.allTimeSeries}
                      filterAllTimeSeries={this.state.filter.allTimeSeries}
                      sampledCoords={this.state.filter.sampledCoords}
                      meanR={this.state.filter.meanR}
                      clusterMatrix={this.state.clustering.clusterMatrix}
                      clusterSampledCoords={this.state.clustering.clusterSampledCoords}
                      nClusterList={this.state.clustering.nClusterList}
                      ordering={this.state.clustering.ordering}
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

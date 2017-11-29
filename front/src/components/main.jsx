import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Sidebar, Segment, Accordion, Icon } from 'semantic-ui-react';

import { loadTiff } from '../intents/intent';

import SideMenu from './side-bar/side-menu.jsx';
import ControlWindow from './control-window/control-window.jsx';
import ResultWindow from './result-window/result-window.jsx';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    // console.log(API_ENDPOINT);

    this.state = {
      activateIndex: 0,
    };

    this.onAccordionClick = this.onAccordionClick.bind(this);
  }

  componentWillMount() {
    this.subscription = this.props.store.subscribe((state) => {
      this.setState(state);
    });
  }

  componentDidMount() {
    loadTiff('trp-3-masked8b_60-259.tif', '2E2_GFB.tif');
  }

  componentWillUnmount() {
    this.subscription.dispose();
  }

  onAccordionClick() {
    if (this.state.activateIndex === 0) {
      this.setState({
        activateIndex: -1,
      });
    } else {
      this.setState({
        activateIndex: 0,
      });
    }
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
                    <Accordion activeIndex={this.state.activateIndex} onTitleClick={this.onAccordionClick}>
                      <Accordion.Title>
                        <Icon name="dropdown" />
                        Analysis Methods window
                      </Accordion.Title>
                      <Accordion.Content>
                        <ControlWindow
                          openModal={this.state.modal.openModal}
                          causalMethodParamsList={this.state.modal.causalMethodParamsList}
                        />
                      </Accordion.Content>
                    </Accordion>
                    <div>
                      <ResultWindow
                        allTiffList={this.state.data.allTiffList}
                        width={this.state.data.width}
                        dataType={this.state.data.dataType}
                        filterAllTimeSeries={this.state.filter.filterAllTimeSeries}
                        sampledAllTimeSeries={this.state.filter.sampledAllTimeSeries}
                        sampledCoords={this.state.filter.sampledCoords}
                        meanR={this.state.filter.meanR}
                        windowSize={this.state.filter.windowSize}
                        corrMatrices={this.state.clustering.corrMatrices}
                        lagMatrices={this.state.clustering.lagMatrices}
                        clusterMatrices={this.state.clustering.clusterMatrices}
                        clusterSampledCoords={this.state.clustering.clusterSampledCoords}
                        clusterRangeLists={this.state.clustering.clusterRangeLists}
                        nClusterLists={this.state.clustering.nClusterLists}
                        networks={this.state.network.networks}
                        selectedClusterLists={this.state.canvasEvent.selectedClusterLists}
                        selectedTimeSeriesLists={this.state.canvasEvent.selectedTimeSeriesLists}
                        pointToAllCausals={this.state.canvasEvent.pointToAllCausals}
                        pointToNearCausals={this.state.canvasEvent.pointToNearCausals}
                      />
                    </div>
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

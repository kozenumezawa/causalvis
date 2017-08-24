import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Sidebar, Segment, Button, Step } from 'semantic-ui-react';

import { addText, fetchTiff } from '../actions/actions';

import SideMenu from './side-bar/side-menu.jsx';


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchData('2E2_GFB.tif');
  }

  render() {
    const steps = [
      { icon: 'image', title: 'Data', description: 'Analysis movie' },
      { icon: 'crop', title: 'generateTimeSeries', description: 'create time series from movie' },
      { icon: 'line graph', title: 'Granger Causality' },
      // { disabled: true, icon: 'line graph', title: 'Granger Causality' },
      { active: true, icon: 'grid layout', title: 'IRM', description: 'Infinite Relational Modeling' },
    ];

    return (
      <div>
        <Switch>
          <Route
            exact path="/"
            render={() => (
              <div>
                <Sidebar.Pushable as={Segment}>
                  <SideMenu />

                  <Sidebar.Pusher>
                    <Segment style={{ height: 200 }}>
                      <div>
                        <br />
                        <Step.Group items={steps} />
                      </div>
                    </Segment>
                    <Segment style={{ height: 400 }}>
                      <input type="text" ref="input" />``
                      <br />
                      <button onClick={(e) => this.onAddBtnClicked(e)}>
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


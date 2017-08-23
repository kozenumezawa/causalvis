import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { addText, fetchTiff } from '../actions/actions';

import { Sidebar, Segment, Button, Menu, Image, Header } from 'semantic-ui-react';;
import { Icon, Step } from 'semantic-ui-react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.props.fetchData('2E2_GFB.tif');

    this.onAddBtnClicked = this.onAddBtnClicked.bind(this);
    this.state = { visible: true };
  }

  render() {
    const { activeItem } = this.state || {};
    const steps = [
      { icon: 'truck', title: 'Data', description: 'Analysis movie' },
      { active: true, icon: 'payment', title: 'generateTimeSeries', description: 'create time series from movie' },
      { disabled: true, icon: 'info', title: 'Granger Causality' },
    ];

    return (
      <div>
        <Switch>
          <Route
            exact path="/"
            render={() => (
              <div>
                <Sidebar.Pushable as={Segment}>
                  <Sidebar as={Menu} animation='uncover' width='thin' visible={this.state.visible} icon='labeled' vertical inverted>
                    <Menu.Item>
                      <Menu.Header>Methods</Menu.Header>

                      <Menu.Menu>
                        <Menu.Item name='Granger Causality' active={activeItem === 'enterprise'} onClick={this.handleItemClick} />
                        <Menu.Item name='Cross Correlation' active={activeItem === 'consumer'} onClick={this.handleItemClick} />
                        <Menu.Item name='CCM  ' active={activeItem === 'consumer'} onClick={this.handleItemClick} />
                      </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Header>Item</Menu.Header>

                      <Menu.Menu>
                        <Menu.Item name='create Time Series' active={activeItem === 'rails'} onClick={this.handleItemClick} />
                      </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Header>Filter</Menu.Header>

                      <Menu.Menu>
                        <Menu.Item name='mean filter' active={activeItem === 'shared'} onClick={this.handleItemClick} />
                      </Menu.Menu>
                    </Menu.Item>
                  </Sidebar>

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

  onAddBtnClicked(e) {
    const text = "test";
    this.props.addText(text);
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


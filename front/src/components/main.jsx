import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { addText } from '../actions/actions';

import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.onAddBtnClicked = this.onAddBtnClicked.bind(this);
    this.state = { visible: true };
  }

  render() {
    const { activeItem } = this.state || {}

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
                      <Menu.Header>Products</Menu.Header>

                      <Menu.Menu>
                        <Menu.Item name='enterprise' active={activeItem === 'enterprise'} onClick={this.handleItemClick} />
                        <Menu.Item name='consumer' active={activeItem === 'consumer'} onClick={this.handleItemClick} />
                      </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Header>CMS Solutions</Menu.Header>

                      <Menu.Menu>
                        <Menu.Item name='rails' active={activeItem === 'rails'} onClick={this.handleItemClick} />
                        <Menu.Item name='python' active={activeItem === 'python'} onClick={this.handleItemClick} />
                        <Menu.Item name='php' active={activeItem === 'php'} onClick={this.handleItemClick} />
                      </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Header>Hosting</Menu.Header>

                      <Menu.Menu>
                        <Menu.Item name='shared' active={activeItem === 'shared'} onClick={this.handleItemClick} />
                        <Menu.Item name='dedicated' active={activeItem === 'dedicated'} onClick={this.handleItemClick} />
                      </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                      <Menu.Header>Support</Menu.Header>

                      <Menu.Menu>
                        <Menu.Item name='email' active={activeItem === 'email'} onClick={this.handleItemClick}>
                          E-mail Support
                        </Menu.Item>

                        <Menu.Item name='faq' active={activeItem === 'faq'} onClick={this.handleItemClick}>
                          FAQs
                        </Menu.Item>
                      </Menu.Menu>
                    </Menu.Item>
                  </Sidebar>
                  <Sidebar.Pusher>
                    <Segment basic style={{ height: 500 }}>
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
    this.props.dispatch(addText(text));
  }
}

const selector = (state) => {
  return {
    state: state,
  };
};

export default connect(selector)(Main);


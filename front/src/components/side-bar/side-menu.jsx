import React from 'react';

import { Sidebar, Menu } from 'semantic-ui-react';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = { visible: true };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(_, { name }) {
    console.log(name);
  }

  render() {
    return (
      <Sidebar as={Menu} animation="uncover" width="thin" visible={this.state.visible} icon="labeled" vertical inverted>
        <Menu.Item header style={{ color: 'white', fontSize: 20 }}>
          Causal Vis
        </Menu.Item>
        <Menu.Item>
          <Menu.Header>Methods</Menu.Header>

          <Menu.Menu>
            <Menu.Item name="Granger Causality" onClick={this.handleItemClick} />
            <Menu.Item name="Cross Correlation" onClick={this.handleItemClick} />
            <Menu.Item name="CCM" onClick={this.handleItemClick} />
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Item</Menu.Header>

          <Menu.Menu>
            <Menu.Item name="create Time Series" onClick={this.handleItemClick} />
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Filter</Menu.Header>

          <Menu.Menu>
            <Menu.Item name="mean filter" onClick={this.handleItemClick} />
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Clustering</Menu.Header>

          <Menu.Menu>
            <Menu.Item name="IRM" onClick={this.handleItemClick} />
          </Menu.Menu>
        </Menu.Item>
      </Sidebar>
    );
  }
}

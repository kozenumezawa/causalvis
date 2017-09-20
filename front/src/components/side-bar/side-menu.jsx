import React from 'react';

import { Sidebar, Menu, Checkbox } from 'semantic-ui-react';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.viewLists = ['Original Data', 'Cluster Matrix', 'Cluster View', 'Graph'];

    this.state = { visible: true };
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  handleItemClick(event, data) {
    const name = data.name
    console.log(data.value, name);
  }

  handleCheckClick(event, data) {
    switch (data.value) {
      case this.viewLists[0]:
        break;
      case this.viewLists[1]:
        break;
      case this.viewLists[2]:
        break;
      case this.viewLists[3]:
        break;
      default:
    }
  }

  renderCheckBoxes() {
    const renderData = this.viewLists.map((dataName, idx) => {
      return (
        <div>
          <Menu.Item key={`view list${idx}`} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <div>
              {`${dataName}`}
            </div>
            <div style={{ width: 10 }} />
            <Checkbox value={`${dataName}`} onClick={this.handleCheckClick} />
          </Menu.Item>
        </div>
      );
    });
    return renderData;
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
          <Menu.Header>Filter</Menu.Header>
          <Menu.Menu>
            {(() => {
              return this.renderCheckBoxes.bind(this)();
            })()}
          </Menu.Menu>
        </Menu.Item>
      </Sidebar>
    );
  }
}

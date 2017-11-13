import React from 'react';

import { Sidebar, Menu, Checkbox } from 'semantic-ui-react';

export default class SideMenu extends React.Component {
  constructor(props) {
    super(props);

    this.viewLists = ['Original Data', 'Network View', 'Matrix View', 'Shape View', 'Graph View'];

    this.state = { visible: true };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.renderCheckBoxes = this.renderCheckBoxes.bind(this);
  }

  handleItemClick(event, data) {
    const name = data.name;
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
        <div key={`view list${idx}`}>
          <Menu.Item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <div>
              {`${dataName}`}
            </div>
            <div style={{ width: 10 }} />
            <Checkbox value={`${dataName}`} onClick={this.handleCheckClick} checked />
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
          <Menu.Header>Left Data</Menu.Header>
          <Menu.Menu>
            {(() => {
              return this.renderCheckBoxes();
            })()}
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Rightr Data</Menu.Header>
          <Menu.Menu>
            {(() => {
              return this.renderCheckBoxes();
            })()}
          </Menu.Menu>
        </Menu.Item>
      </Sidebar>
    );
  }
}

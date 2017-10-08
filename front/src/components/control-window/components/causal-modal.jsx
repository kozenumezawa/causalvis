import React from 'react';

import { Modal, Header, Tab } from 'semantic-ui-react';

export default class CausalModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 1,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(e, { activeIndex }) {
    this.setState({ activeIndex });
  }

  render() {
    const panes = [
      { menuItem: 'Granger Causality', render: () => <Tab.Pane>Tab 1 Content</Tab.Pane> },
      { menuItem: 'Convergent Cross Mapping', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
      { menuItem: 'Cross Correlation', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
    ];

    return (
      <Modal.Content>
        <Modal.Description>
          <Header>
            Default Profile Image
          </Header>
          <Tab
            panes={panes}
            activeIndex={this.state.activeIndex}
            onTabChange={this.handleTabChange}
          />
        </Modal.Description>
      </Modal.Content>
    );
  }
}

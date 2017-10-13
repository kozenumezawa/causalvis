import React from 'react';
import { Modal, Button, Header, Tab, Dropdown } from 'semantic-ui-react';

import { closeModal } from '../../../intents/intent';

export default class CausalModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 2,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.close = this.close.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onOKClick = this.onOKClick.bind(this);
  }

  onCancelClick() {
    closeModal();
  }

  onOKClick() {
    closeModal();
  }

  close() {
    closeModal();
  }

  handleTabChange(e, { activeIndex }) {
    this.setState({ activeIndex });
  }

  renderCCM() {
    return (
      <Tab.Pane>CCM</Tab.Pane>
    );
  }

  renderGranger() {
    return (
      <Tab.Pane>Granger</Tab.Pane>
    );
  }

  renderCross() {
    const selectionList = [
      {
        paramText: 'time steps per lag',
        paramName: 'stepsPerLag',
        options: [
          {
            text: 0,
            value: 0,
          },
          {
            text: 1,
            value: 1,
          },
        ],
      },
      {
        paramText: 'max lag',
        paramName: 'maxLag',
        options: [
          {
            text: 0,
            value: 0,
          },
          {
            text: 1,
            value: 1,
          },
        ],
      },
    ];
    return (
      <Tab.Pane>
        <form name="pramsForm">
          <div style={{ marginLeft: '20%', marginRight: '20%' }} >
            {(() => {
              return selectionList.map((selection, idx) => {
                return (
                  <div key={`selection_${idx}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{selection.paramText}</div>
                    <Dropdown
                      selection
                      name={selection.paramName}
                      options={selection.options}
                      defaultValue={0}
                      onChange={(e, d) => { console.log(d.name, d.value); }}
                    />
                  </div>
                );
              });
            })()}
          </div>
        </form>
      </Tab.Pane>
    );
  }

  render() {
    const panes = [
      { menuItem: 'Granger Causality', render: this.renderCCM },
      { menuItem: 'Convergent Cross Mapping', render: this.renderGranger },
      { menuItem: 'Cross Correlation', render: this.renderCross },
    ];

    return (
      <Modal dimmer={'inverted'} open={this.props.openModal} onClose={this.close}>
        <Modal.Header>
          { 'Change causal inference method' }
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>
              Select Causal Inference Method
            </Header>
            <Tab
              panes={panes}
              activeIndex={this.state.activeIndex}
              onTabChange={this.handleTabChange}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={this.onCancelClick}>
            Cancel
          </Button>
          <Button positive onClick={this.onOKClick}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

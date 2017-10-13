import React from 'react';
import { Modal, Button, Header, Tab, Dropdown } from 'semantic-ui-react';

import { closeModal } from '../../../intents/intent';

export default class CausalModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 2,
    };

    this.methodParams = {
      stepsPerLag: 1,
      maxLag: 20,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.close = this.close.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onOKClick = this.onOKClick.bind(this);
    this.renderCross = this.renderCross.bind(this);
  }

  onCancelClick() {
    closeModal();
  }

  onOKClick() {
    console.log(this.methodParams);
    closeModal();
  }

  close() {
    closeModal();
  }

  handleTabChange(e, { activeIndex }) {
    this.setState({ activeIndex });
  }

  handleDropDownChange(e, { name, value }) {
    Object.assign(this.methodParams, {
      [name]: value,
    });
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
    const stepsPerLagList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const maxLagList = stepsPerLagList.map((stepsPerLag) => {
      return stepsPerLag * 10;
    });
    const selectionList = [
      {
        paramText: 'time steps per lag',
        paramName: 'stepsPerLag',
        options: stepsPerLagList.map((stepsPerLag) => {
          return {
            text: stepsPerLag,
            value: stepsPerLag,
          };
        }),
      },
      {
        paramText: 'max lag',
        paramName: 'maxLag',
        options: maxLagList.map((maxLag) => {
          return {
            text: maxLag,
            value: maxLag,
          };
        }),
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
                      onChange={this.handleDropDownChange}
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

import React from 'react';
import { Modal, Button, Header, Tab, Dropdown } from 'semantic-ui-react';

import { closeModal } from '../../../intents/intent';

export default class CausalModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };

    this.causalMethodParams = props.causalMethodParams;

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleCrossDropDownChange = this.handleCrossDropDownChange.bind(this);
    this.handleCCMDropDownChange = this.handleCCMDropDownChange.bind(this);
    this.handleGrangerDropDownChange = this.handleGrangerDropDownChange.bind(this);
    this.close = this.close.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onOKClick = this.onOKClick.bind(this);
    this.renderCross = this.renderCross.bind(this);
    this.renderCCM = this.renderCCM.bind(this);
    this.renderGranger = this.renderGranger.bind(this);
  }

  onCancelClick() {
    closeModal();
  }

  onOKClick() {
    console.log(this.causalMethodParams);
    closeModal();
  }

  close() {
    closeModal();
  }

  handleTabChange(e, { activeIndex }) {
    this.setState({ activeIndex });
  }

  handleCrossDropDownChange(e, { name, value }) {
    Object.assign(this.causalMethodParams.cross, {
      [name]: value,
    });
  }

  handleCCMDropDownChange(e, { name, value }) {
    Object.assign(this.causalMethodParams.ccm, {
      [name]: value,
    });
  }

  handleGrangerDropDownChange(e, { name, value }) {
    Object.assign(this.causalMethodParams.granger, {
      [name]: value,
    });
  }

  renderCCM() {
    const selectionList = [
      {
        paramText: 'Embedding Dimension',
        paramName: 'E',
        options: this.props.causalMethodParams.ccm.EList.map((E) => {
          return {
            text: E,
            value: E,
          };
        }),
      },
      {
        paramText: 'tau',
        paramName: 'tau',
        options: this.props.causalMethodParams.ccm.tauList.map((tau) => {
          return {
            text: tau,
            value: tau,
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
                  <div key={`ccmSelection_${idx}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{selection.paramText}</div>
                    <Dropdown
                      selection
                      name={selection.paramName}
                      options={selection.options}
                      defaultValue={this.props.causalMethodParams.ccm[selection.paramName]}
                      onChange={this.handleCCMDropDownChange}
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

  renderGranger() {
    const selectionList = [
      {
        paramText: 'k',
        paramName: 'k',
        options: this.props.causalMethodParams.granger.kList.map((k) => {
          return {
            text: k,
            value: k,
          };
        }),
      },
      {
        paramText: 'm',
        paramName: 'm',
        options: this.props.causalMethodParams.granger.mList.map((m) => {
          return {
            text: m,
            value: m,
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
                  <div key={`grangerSelection_${idx}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{selection.paramText}</div>
                    <Dropdown
                      selection
                      name={selection.paramName}
                      options={selection.options}
                      defaultValue={this.props.causalMethodParams.granger[selection.paramName]}
                      onChange={this.handleGrangerDropDownChange}
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

  renderCross() {
    const selectionList = [
      {
        paramText: 'time steps per lag',
        paramName: 'stepsPerLag',
        options: this.props.causalMethodParams.cross.stepsPerLagList.map((stepsPerLag) => {
          return {
            text: stepsPerLag,
            value: stepsPerLag,
          };
        }),
      },
      {
        paramText: 'max lag',
        paramName: 'maxLag',
        options: this.props.causalMethodParams.cross.maxLagList.map((maxLag) => {
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
                  <div key={`crossSelection_${idx}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>{selection.paramText}</div>
                    <Dropdown
                      selection
                      name={selection.paramName}
                      options={selection.options}
                      defaultValue={this.props.causalMethodParams.cross[selection.paramName]}
                      onChange={this.handleCrossDropDownChange}
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
      { menuItem: 'Cross Correlation', render: this.renderCross },
      { menuItem: 'Convergent Cross Mapping', render: this.renderCCM },
      { menuItem: 'Granger Causality', render: this.renderGranger },
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

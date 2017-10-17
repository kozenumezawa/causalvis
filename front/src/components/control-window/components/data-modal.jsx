import React from 'react';
import { Modal, Button, Header, Form, Checkbox } from 'semantic-ui-react';

import { closeModal, setNewData } from '../../../intents/intent';
import { DATA_SIM, DATA_TRP3, DATA_WILD } from '../../../constants/general-constants';

export default class DataModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.close = this.close.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onOKClick = this.onOKClick.bind(this);
  }

  onCancelClick() {
    closeModal();
  }

  onOKClick() {
    console.log(this.props.position);
    setNewData(this.state.value, this.props.position);
    closeModal();
  }

  close() {
    closeModal();
  }

  handleRadioChange(e, { value }) {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <Modal dimmer={'inverted'} open={this.props.openModal} onClose={this.close}>
        <Modal.Header>
          { 'Change dataset' }
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>
              Select dataset which is displayed
            </Header>
            <Form>
              <Form.Field>
                <Checkbox
                  radio
                  label="Simulation Data"
                  name="checkboxRadioGroup"
                  value={DATA_SIM}
                  checked={this.state.value === DATA_SIM}
                  onChange={this.handleRadioChange}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  radio
                  label="Wild Type Data"
                  name="checkboxRadioGroup"
                  value={DATA_WILD}
                  checked={this.state.value === DATA_WILD}
                  onChange={this.handleRadioChange}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  radio
                  label="TRP-3 mutant Data"
                  name="checkboxRadioGroup"
                  value={DATA_TRP3}
                  checked={this.state.value === DATA_TRP3}
                  onChange={this.handleRadioChange}
                />
              </Form.Field>
            </Form>
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

import React from 'react';
import { Modal, Button, Header, Dropdown } from 'semantic-ui-react';

import { closeModal, setNewFilter } from '../../../intents/intent';

export default class FilteraModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'meanFilter',
      params: {
        windowSize: 3,
      },
    };

    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.close = this.close.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.onOKClick = this.onOKClick.bind(this);
  }

  onCancelClick() {
    closeModal();
  }

  onOKClick() {
    setNewFilter(this.state, this.props.position);
  }

  close() {
    closeModal();
  }

  handleDropDownChange(e, { value }) {
    this.setState({
      params: {
        windowSize: value,
      },
    });
  }

  render() {
    const windowSizes = [1, 3, 5, 7, 9];
    return (
      <Modal dimmer={'inverted'} open={this.props.openModal} onClose={this.close}>
        <Modal.Header>
          { 'Set filter parameters' }
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>
              Select window size of the mean filter
            </Header>
            <form name="pramsForm">
              <div style={{ marginLeft: '20%', marginRight: '20%' }} >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>{'window size'}</div>
                  <Dropdown
                    selection
                    name={'windowSize'}
                    options={windowSizes.map((windowSize) => {
                      return {
                        text: windowSize,
                        value: windowSize,
                      };
                    })}
                    defaultValue={this.state.params.windowSize}
                    onChange={this.handleDropDownChange}
                  />
                </div>
              </div>
            </form>
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

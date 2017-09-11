import React from 'react';

import { Modal, Header, Button } from 'semantic-ui-react';

import CausalinferenceModal from './causalinference-modal.jsx';

export default class ModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      modalContent: '',
      modalHeader: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openModal === false) {
      return;
    }

    this.setState({
      open: true,
      modalContent: nextProps.icon,
    });

    switch (nextProps.icon) {
      case 'image':
        this.setState({ modalHeader: 'Change data' });
        break;
      case 'filter':
        this.setState({ modalHeader: 'Change filter' });
        break;
      case 'line graph':
        this.setState({ modalHeader: 'Change causal inference' });
        break;
      default:
    }
    console.log(nextProps.position);
  }

  onCancelClick() {
    this.setState({ open: false });
  }

  onOKClick() {
    this.setState({ open: false });
  }

  close() {
    this.setState({ open: false });
  }

  renderModalContent() {
    return (
      <CausalinferenceModal />
    );
  }

  render() {
    return (
      <Modal dimmer={'inverted'} open={this.state.open} onClose={this.close.bind(this)}>
        <Modal.Header>
          { this.state.modalHeader }
        </Modal.Header>
        {(() => {
          return this.renderModalContent();
        })()}
        <Modal.Actions>
          <Button color="black" onClick={this.onCancelClick.bind(this)}>
            Cancel
          </Button>
          <Button positive onClick={this.onOKClick.bind(this)}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

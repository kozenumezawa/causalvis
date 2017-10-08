import React from 'react';
import { Modal, Button } from 'semantic-ui-react';

import { closeModal } from '../../../intents/intent';

import CausalinferenceModal from './causalinference-modal.jsx';

export default class ModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: '',
      modalHeader: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.openModal === false) {
      return;
    }

    this.setState({
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
    closeModal();
  }

  onOKClick() {
    closeModal();
  }

  close() {
    closeModal();
  }

  renderModalContent() {
    return (
      <CausalinferenceModal />
    );
  }

  render() {
    return (
      <Modal dimmer={'inverted'} open={this.props.openModal} onClose={this.close.bind(this)}>
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

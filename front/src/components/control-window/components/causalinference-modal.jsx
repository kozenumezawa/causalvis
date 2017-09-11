import React from 'react';

import { Modal, Header } from 'semantic-ui-react';

export default class CausalinferenceModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal.Content>
        <Modal.Description>
          <Header>
            Default Profile Image
          </Header>
          <p>
            aaaaaa
          </p>
        </Modal.Description>
      </Modal.Content>
    );
  }
}

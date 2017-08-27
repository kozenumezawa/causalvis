import React from 'react';

import { Segment } from 'semantic-ui-react';

// import ClusterMatrix from './components/cluster-matrix.jsx';

export default class ResultWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment style={{ height: 400 }}>
        {/*<ClusterMatrix />*/}
      </Segment>
    );
  }
}

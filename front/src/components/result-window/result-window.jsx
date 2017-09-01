import React from 'react';

import { Segment } from 'semantic-ui-react';

import ClusterMatrix from './components/cluster-matrix.jsx';

export default class ResultWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Segment>
        <ClusterMatrix
          allTiffList={this.props.allTiffList}
          allTimeSeries={this.props.allTimeSeries}
          meanR={this.props.meanR}
          clusterMatrix={this.props.clusterMatrix}
          clusterSampledCoords={this.props.clusterSampledCoords}
          nClusterList={this.props.nClusterList}
        />
      </Segment>
    );
  }
}

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
          allTiffList={this.props.allTiffList[0]}
          allTimeSeries={this.props.allTimeSeries[0]}
          meanR={this.props.meanR[0]}
          clusterMatrix={this.props.clusterMatrix[0]}
          clusterSampledCoords={this.props.clusterSampledCoords[0]}
          nClusterList={this.props.nClusterList[0]}
        />
      </Segment>
    );
  }
}

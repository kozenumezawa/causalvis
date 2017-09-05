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
          id={0}
          allTiffList={this.props.allTiffList[0]}
          allTimeSeries={this.props.allTimeSeries[0]}
          meanR={this.props.meanR[0]}
          clusterMatrix={this.props.clusterMatrix[0]}
          clusterSampledCoords={this.props.clusterSampledCoords[0]}
          nClusterList={this.props.nClusterList[0]}
        />

        <ClusterMatrix
          id={1}
          allTiffList={this.props.allTiffList[0]}
          allTimeSeries={this.props.allTimeSeries[1]}
          meanR={this.props.meanR[1]}
          clusterMatrix={this.props.clusterMatrix[1]}
          clusterSampledCoords={this.props.clusterSampledCoords[1]}
          nClusterList={this.props.nClusterList[1]}
        />
      </Segment>
    );
  }
}

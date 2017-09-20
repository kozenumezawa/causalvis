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
          filterAllTimeSeries={this.props.filterAllTimeSeries[0]}
          meanR={this.props.meanR[0]}
          meanStep={this.props.meanStep[0]}
          clusterMatrix={this.props.clusterMatrices[0]}
          clusterSampledCoords={this.props.clusterSampledCoords[0]}
          clusterRangeList={this.props.clusterRangeLists[0]}
          nClusterList={this.props.nClusterLists[0]}
          width={this.props.width[0]}
          scale={2}
          cellScale={0.5}
          network={this.props.networks[0]}
          positionIdx={0}
          selectedClusterList={this.props.selectedClusterLists[0]}
          selectedTimeSeriesList={this.props.selectedTimeSeriesLists[0]}
          pointToAllCausal={this.props.pointToAllCausals[0]}
        />

        <ClusterMatrix
          id={1}
          allTiffList={this.props.allTiffList[0]}
          allTimeSeries={this.props.allTimeSeries[1]}
          filterAllTimeSeries={this.props.filterAllTimeSeries[1]}
          meanR={this.props.meanR[1]}
          meanStep={this.props.meanStep[1]}
          clusterMatrix={this.props.clusterMatrices[1]}
          clusterSampledCoords={this.props.clusterSampledCoords[1]}
          clusterRangeList={this.props.clusterRangeLists[1]}
          nClusterList={this.props.nClusterLists[1]}
          width={this.props.width[1]}
          scale={4}
          cellScale={1}
          network={this.props.networks[1]}
          positionIdx={1}
          selectedClusterList={this.props.selectedClusterLists[1]}
          selectedTimeSeriesList={this.props.selectedTimeSeriesLists[1]}
          pointToAllCausal={this.props.pointToAllCausals[1]}
        />
      </Segment>
    );
  }
}

import React from 'react';
import { Segment } from 'semantic-ui-react';

import ClusterMatrix from './components/cluster-matrix.jsx';
import ClusterHeatmap from './components/cluster-heatmap.jsx';
import OriginalCanvas from './components/original-canvas.jsx';
import NetworkView from './components/network-view.jsx';
import GraphContainer from './components/graph-container.jsx';
import DetailGraphContainer from './components/detail-graph-container.jsx';

export default class ResultWindow extends React.Component {
  constructor(props) {
    super(props);

    this.scale = [2, 4];
  }

  renderOriginalCanvas() {
    if (this.props.allTimeSeries[0] == null) {
      return [];
    }
    return this.props.allTimeSeries.map((id, idx) => {
      return (
        <OriginalCanvas
          id={idx}
          allTimeSeries={this.props.allTimeSeries[idx]}
          width={this.props.width[idx]}
          scale={this.scale[idx]}
        />
      );
    });
  }

  renderNetworkView() {
    return this.props.networks.map((network, idx) => {
      return (
        <NetworkView
          network={this.props.networks[idx]}
          positionIdx={idx}
        />
      );
    });
  }

  renderGraphContainer() {
    return this.props.selectedTimeSeriesLists.map((selectedTimeSeriesList) => {
      return (
        <GraphContainer
          dataContainer={selectedTimeSeriesList.averageData}
        />
      );
    });
  }
  render() {
    return (
      <div style={{ position: 'relative', top: 50, height: 1000 }}>
        <div style={{ position: 'absolute', left: 50 }} >
          {
            (() => {
              return this.renderOriginalCanvas();
            })()
          }
        </div>

        <div>
          <ClusterMatrix
            style={{ position: 'absolute', top: 4, left: 550 }}
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
            style={{ position: 'absolute', top: 0, left: 810 }}
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
        </div>
        <div style={{ position: 'absolute', top: 250, left: 50 }} >
          {
            (() => {
              return this.renderNetworkView();
            })()
          }
        </div>

        <div>
          <ClusterHeatmap
            style={{ position: 'absolute', top: 250, left: 550 }}
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

          <ClusterHeatmap
            style={{ position: 'absolute', top: 250, left: 850 }}
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
        </div>

        <div style={{ position: 'absolute', top: 600, left: 550 }} >
          {
            (() => {
              return this.renderGraphContainer();
            })()
          }
        </div>
        {/*<DetailGraphContainer*/}
        {/*dataContainer={this.props.selectedTimeSeriesList.rawData}*/}
        {/*/>*/}
      </div>
    );
  }
}

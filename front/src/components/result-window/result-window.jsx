import React from 'react';

import { DATA_SIM, DATA_TRP3, DATA_WILD, DATA_TRP3_RAW } from '../../constants/general-constants';

import ClusterShape from './components/cluster-shape.jsx';
import ClusterHeatmap from './components/cluster-heatmap.jsx';
import OriginalCanvas from './components/original-canvas.jsx';
import NetworkView from './components/network-view.jsx';
import GraphContainer from './components/graph-container.jsx';
import PointToAllView from './components/point-to-all-view.jsx';
import PointToNearView from './components/point-to-near-view.jsx';

export default class ResultWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scale: [2, 4],
      cellScale: [0.5, 1],
    };
  }

  componentWillReceiveProps(nextProps) {
    const newScale = [];
    const newCellScale = [];
    nextProps.dataType.forEach((dataType) => {
      switch (dataType) {
        case DATA_SIM:
          newScale.push(4);
          newCellScale.push(1);
          break;
        case DATA_TRP3:
          newScale.push(2);
          newCellScale.push(0.5);
          break;
        case DATA_WILD:
          newScale.push(1);
          newCellScale.push(0.25);
          break;
        case DATA_TRP3_RAW:
          newScale.push(2);
          newCellScale.push(0.5);
          break;
        default:
          break;
      }
    });
    this.setState({
      scale: newScale,
      cellScale: newCellScale,
    });
  }

  renderOriginalCanvas() {
    if (this.props.allTimeSeries[0] == null) {
      return [];
    }
    const left = [50, 316];
    return this.props.allTimeSeries.map((id, idx) => {
      return (
        <div key={`canvas list${idx}`} style={{ position: 'absolute', left: left[idx] }} >
          <OriginalCanvas
            id={idx}
            allTimeSeries={this.props.allTimeSeries[idx]}
            width={this.props.width[idx]}
            scale={this.state.scale[idx]}
          />
        </div>
      );
    });
  }

  renderNetworkView() {
    const top = 0;
    const left = [600, 930];
    return this.props.networks.map((network, idx) => {
      return (
        <div
          key={`network list${idx}`}
          style={{ position: 'absolute', top, left: left[idx], border: '1px solid gray' }}
        >
          <NetworkView
            network={this.props.networks[idx]}
            positionIdx={idx}
            selectedClusterList={this.props.selectedClusterLists[idx]}
          />
        </div>
      );
    });
  }

  renderGraphContainer() {
    const top = 640;
    const left = [600, 920];
    return this.props.selectedTimeSeriesLists.map((selectedTimeSeriesList, idx) => {
      return (
        <div key={`graph list${idx}`} style={{ position: 'absolute', top, left: left[idx] }} >
          <GraphContainer
            dataContainer={selectedTimeSeriesList.averageData}
            rawContainer={selectedTimeSeriesList.rawData}
          />
        </div>
      );
    });
  }

  render() {
    return (
      <div style={{ position: 'relative', top: 50, height: 1200 }}>
        {
          /*
          (() => {
            return this.renderOriginalCanvas();
          })()
          */
        }
        <div>
          <ClusterShape
            style={{ position: 'absolute', top: 244, left: 50 }}
            id={0}
            allTimeSeries={this.props.allTimeSeries[0]}
            windowSize={this.props.windowSize[0]}
            clusterMatrix={this.props.clusterMatrices[0]}
            clusterSampledCoords={this.props.clusterSampledCoords[0]}
            clusterRangeList={this.props.clusterRangeLists[0]}
            nClusterList={this.props.nClusterLists[0]}
            width={this.props.width[0]}
            scale={this.state.scale[0]}
            positionIdx={0}
            selectedClusterList={this.props.selectedClusterLists[0]}
          />

          <ClusterShape
            style={{ position: 'absolute', top: 240, left: 316 }}
            id={1}
            allTimeSeries={this.props.allTimeSeries[1]}
            windowSize={this.props.windowSize[1]}
            clusterMatrix={this.props.clusterMatrices[1]}
            clusterSampledCoords={this.props.clusterSampledCoords[1]}
            clusterRangeList={this.props.clusterRangeLists[1]}
            nClusterList={this.props.nClusterLists[1]}
            width={this.props.width[1]}
            scale={this.state.scale[1]}
            positionIdx={1}
            selectedClusterList={this.props.selectedClusterLists[1]}
          />
        </div>

        {
          /*
          (() => {
            return this.renderNetworkView();
          })()
          */
        }
        <div>
          <ClusterHeatmap
            style={{ position: 'absolute', top: 300, left: 580 }}
            id={0}
            allTiffList={this.props.allTiffList[0]}
            allTimeSeries={this.props.allTimeSeries[0]}
            clusterMatrix={this.props.clusterMatrices[0]}
            clusterSampledCoords={this.props.clusterSampledCoords[0]}
            clusterRangeList={this.props.clusterRangeLists[0]}
            nClusterList={this.props.nClusterLists[0]}
            cellScale={this.state.cellScale[0]}
            positionIdx={0}
            selectedClusterList={this.props.selectedClusterLists[0]}
          />

          <ClusterHeatmap
            style={{ position: 'absolute', top: 300, left: 900 }}
            id={1}
            allTiffList={this.props.allTiffList[1]}
            allTimeSeries={this.props.allTimeSeries[1]}
            clusterMatrix={this.props.clusterMatrices[1]}
            clusterSampledCoords={this.props.clusterSampledCoords[1]}
            clusterRangeList={this.props.clusterRangeLists[1]}
            nClusterList={this.props.nClusterLists[1]}
            cellScale={this.state.cellScale[1]}
            positionIdx={1}
            selectedClusterList={this.props.selectedClusterLists[1]}
          />
        </div>

        {
          (() => {
            return this.renderGraphContainer();
          })()
        }

        <div>
          <PointToNearView
            style={{ position: 'absolute', top: 780, left: 100 }}
            id={0}
            positionIdx={0}
            pointToNearCausal={this.props.pointToNearCausals[0]}
          />
          <PointToNearView
            style={{ position: 'absolute', top: 780, left: 340 }}
            id={1}
            positionIdx={1}
            pointToNearCausal={this.props.pointToNearCausals[1]}
          />
        </div>
        <div>
          <PointToAllView
            style={{ position: 'absolute', top: 550, left: 50 }}
            id={0}
            allTimeSeries={this.props.allTimeSeries[0]}
            windowSize={this.props.windowSize[0]}
            clusterSampledCoords={this.props.clusterSampledCoords[0]}
            width={this.props.width[0]}
            scale={this.state.scale[0]}
            positionIdx={0}
            pointToAllCausal={this.props.pointToAllCausals[0]}
          />
          <PointToAllView
            style={{ position: 'absolute', top: 550, left: 316 }}
            id={1}
            allTimeSeries={this.props.allTimeSeries[1]}
            windowSize={this.props.windowSize[1]}
            clusterSampledCoords={this.props.clusterSampledCoords[1]}
            width={this.props.width[1]}
            scale={this.state.scale[1]}
            positionIdx={1}
            pointToAllCausal={this.props.pointToAllCausals[1]}
          />
        </div>
      </div>
    );
  }
}

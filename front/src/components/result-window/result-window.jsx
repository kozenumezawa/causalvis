import React from 'react';
import { Image, Label } from 'semantic-ui-react';

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
    if (this.props.filterAllTimeSeries[0] == null) {
      return [];
    }
    const left = [50, 316];
    return this.props.filterAllTimeSeries.map((id, idx) => {
      if (idx === 1) {
        return <div />;
      }
      return (
        <div key={`canvas list${idx}`} style={{ position: 'absolute', top: 10, left: left[idx] }} >
          <OriginalCanvas
            id={idx}
            allTimeSeries={this.props.filterAllTimeSeries[idx]}
            width={this.props.width[idx]}
            scale={this.state.scale[idx]}
          />
        </div>
      );
    });
  }

  renderNetworkView() {
    const top = 20;
    const left = [600, 930];
    return this.props.networks.map((network, idx) => {
      if (idx === 1) {
        return <div />;
      }
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
    const top = 710;
    const left = [600, 920];
    return this.props.selectedTimeSeriesLists.map((selectedTimeSeriesList, idx) => {
      if (idx === 1) {
        return <div />;
      }
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
        <div style={{ position: 'absolute', top: -30, left: 20 }}>
          <Label size="large" color="brown">
            Original Images
          </Label>
        </div>
        {
          (() => {
            return this.renderOriginalCanvas();
          })()
        }
        <div style={{ position: 'absolute', top: -30, left: 350 }}>
          <Label size="large" color="brown">
            Cluster View
          </Label>
          <Label size="large" color="green">
            Overview Visualization
          </Label>
        </div>
        <div>
          <ClusterShape
            style={{ position: 'absolute', top: 10, left: 380 }}
            id={0}
            allTimeSeries={this.props.filterAllTimeSeries[0]}
            windowSize={this.props.windowSize[0]}
            clusterMatrix={this.props.clusterMatrices[0]}
            clusterSampledCoords={this.props.clusterSampledCoords[0]}
            clusterRangeList={this.props.clusterRangeLists[0]}
            nClusterList={this.props.nClusterLists[0]}
            width={this.props.width[0]}
            scale={this.state.scale[0]}
            positionIdx={0}
            selectedClusterList={this.props.selectedClusterLists[0]}
            pointToAllCausal={this.props.pointToAllCausals[0]}
          />
        </div>

        <div style={{ position: 'absolute', top: -30, left: 680 }}>
          <Label size="large" color="brown">
            Point-to-All View
          </Label>
          <Label size="large" color="blue">
            Detail Visualization
          </Label>
        </div>
        <div>
          <PointToAllView
            style={{ position: 'absolute', top: 10, left: 710 }}
            id={0}
            allTimeSeries={this.props.filterAllTimeSeries[0]}
            windowSize={this.props.windowSize[0]}
            clusterSampledCoords={this.props.clusterSampledCoords[0]}
            width={this.props.width[0]}
            scale={this.state.scale[0]}
            positionIdx={0}
            pointToAllCausal={this.props.pointToAllCausals[0]}
          />
        </div>

        {/*<div style={{ position: 'absolute', top: -30, left: 570 }}>*/}
          {/*<Label size="large" color="brown">*/}
            {/*Network View*/}
          {/*</Label>*/}
          {/*<Label size="large" color="green">*/}
            {/*Overview Visualization*/}
          {/*</Label>*/}
        {/*</div>*/}
        {/*{*/}
          {/*(() => {*/}
            {/*return this.renderNetworkView();*/}
          {/*})()*/}
        {/*}*/}

        <div style={{ position: 'absolute', top: 300, left: 570 }}>
          <Label size="large" color="brown">
            Adjacency Matrix View
          </Label>
          <Label size="large" color="green">
            Overview Visualization
          </Label>
        </div>
        <div>
          <ClusterHeatmap
            style={{ position: 'absolute', top: 340, left: 580 }}
            id={0}
            allTiffList={this.props.allTiffList[0]}
            allTimeSeries={this.props.filterAllTimeSeries[0]}
            clusterMatrix={this.props.clusterMatrices[0]}
            clusterSampledCoords={this.props.clusterSampledCoords[0]}
            clusterRangeList={this.props.clusterRangeLists[0]}
            nClusterList={this.props.nClusterLists[0]}
            cellScale={this.state.cellScale[0]}
            positionIdx={0}
            selectedClusterList={this.props.selectedClusterLists[0]}
          />
        </div>

        <div style={{ position: 'absolute', top: 660, left: 570 }}>
          <Label size="large" color="brown">
            Time Series Graph View
          </Label>
          <Label size="large" color="green">
            Overview Visualization
          </Label>
        </div>
        {
          (() => {
            return this.renderGraphContainer();
          })()
        }

        <div style={{ position: 'absolute', top: 780, left: 20 }}>
          <Label size="large" color="brown">
            Point-to-Near View
          </Label>
          <Label size="large" color="blue">
            Detail Visualization
          </Label>
        </div>
        <div>
          <PointToNearView
            style={{ position: 'absolute', top: 820, left: 80 }}
            id={0}
            positionIdx={0}
            pointToNearCausal={this.props.pointToNearCausals[0]}
          />
        </div>

        <div style={{ position: 'absolute', top: 1000, left: 140 }}>
          <Image
            src="./lag-legend-rotate.png"
            alt="legend"
            size="medium"
          />
          <div style={{ position: 'absolute', marginLeft: 100 }}>
            lag [time step]
          </div>
          <Label size="medium" style={{ position: 'absolute', width: 315, left: -10, marginTop: 25 }}>
            colormap of the lag which maximizes cross-correlation
          </Label>
        </div>
      </div>
    );
  }
}

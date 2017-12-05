import React from 'react';

import { selectOnePoint } from '../../../intents/intent';
import * as drawingTool from '../../../utils/drawing-tool';

export default class ClusterShape extends React.Component {
  constructor(props) {
    super(props);

    this.legendWidth = 15;
  }

  componentDidMount() {
    this.clusterCanvas = document.getElementById(`cluster_canvas_${this.props.id}`);
    this.clusterCtx = this.clusterCanvas.getContext('2d');
    this.clusterOverlayCanvas = document.getElementById(`cluster_canvas_${this.props.id}_overlay`);
    this.clusterOverlayCtx = this.clusterOverlayCanvas.getContext('2d');

    this.clusterOverlayCanvas.addEventListener('mouseup', this.onMouseUpShape.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allTimeSeries !== this.props.allTimeSeries) {
      this.drawData(nextProps);
    }
    this.drawSelectedCluster(nextProps);
    this.drawClickedPoint(nextProps);
  }

  onMouseUpShape(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectOnePoint(Math.floor(x / this.props.scale), Math.floor(y / this.props.scale), this.props.positionIdx);
  }

  drawSelectedCluster(props) {
    this.clusterOverlayCtx.clearRect(0, 0, this.clusterOverlayCanvas.width, this.clusterOverlayCanvas.height);
    this.clusterOverlayCtx.fillStyle = '#03A9F4';
    // draw heatmap and canvas
    props.selectedClusterList.forEach((belongCluster) => {
      for (let cellIdx = this.clusterRangeList[belongCluster].start;
        cellIdx < this.clusterRangeList[belongCluster].end;
        cellIdx += 1) {
        const x = this.clusterSampledCoords[cellIdx].x * props.scale;
        const y = this.clusterSampledCoords[cellIdx].y * props.scale;
        const sideLength = props.windowSize * props.scale;
        const r = ((props.windowSize - 1) * props.scale) / 2;
        this.clusterOverlayCtx.fillRect(x - r, y - r, sideLength, sideLength);
      }
    });
  }

  drawClickedPoint(props) {
    const { clusterSampledCoords, windowSize, scale } = props;
    const { pointRowIdx, lagLists } = props.pointToAllCausal;
    if (lagLists.length === 0) {
      return;
    }
    this.clusterOverlayCtx.fillStyle = '#43A047';

    const x = clusterSampledCoords[pointRowIdx].x * scale;
    const y = clusterSampledCoords[pointRowIdx].y * scale;
    const sideLength = windowSize * scale;
    const r = ((windowSize - 1) * scale) / 2;
    this.clusterOverlayCtx.fillRect(x - r, y - r, sideLength, sideLength);
  }

  drawData(props) {
    if (props.allTimeSeries == null) {
      return;
    }
    // draw heatmap and canvas according to the graph
    this.graphSorted = props.clusterMatrix;
    this.nClusterList = props.nClusterList;
    this.clusterSampledCoords = props.clusterSampledCoords;

    const color = drawingTool.getBlackBodyColormap(this.nClusterList.length);

    // draw a canvas
    this.clusterCanvas.width = props.width * props.scale;
    this.clusterCanvas.height = (props.allTimeSeries.length / props.width) * props.scale;

    this.clusterOverlayCanvas.width = this.clusterCanvas.width;
    this.clusterOverlayCanvas.height = this.clusterCanvas.height;

    this.clusterRangeList = props.clusterRangeList;
    // draw heatmap and fill canvas
    let clusterIdx = 0;
    this.graphSorted.forEach((row, rowIdx) => {
      if (rowIdx >= this.clusterRangeList[clusterIdx].end) {
        clusterIdx += 1;
      }

      // draw the canvas according to the cluster
      this.clusterCtx.fillStyle = color[clusterIdx];

      const x = this.clusterSampledCoords[rowIdx].x * props.scale;
      const y = this.clusterSampledCoords[rowIdx].y * props.scale;
      const sideLength = props.windowSize * props.scale;
      const r = ((props.windowSize - 1) * props.scale) / 2;
      this.clusterCtx.fillRect(x - r, y - r, sideLength, sideLength);
    });
    drawingTool.drawFrame(this.clusterCanvas, this.clusterCtx);
  }

  render() {
    return (
      <div style={this.props.style}>
        <canvas id={`cluster_canvas_${this.props.id}`} style={{ position: 'absolute', zIndex: 1 }} />
        <canvas id={`cluster_canvas_${this.props.id}_overlay`} style={{ position: 'absolute', zIndex: 2, left: 0 }} />
      </div>
    );
  }
}

import React from 'react';

import { selectCluster, selectOnePoint } from '../../../intents/intent';
import * as drawingTool from '../../../utils/drawing-tool';

export default class ClusterMatrix extends React.Component {
  constructor(props) {
    super(props);

    this.legendWidth = 15;
  }

  componentDidMount() {
    this.heatmapCanvas = document.getElementById(`heatmap_canvas_${this.props.id}`);
    this.heatmapCtx = this.heatmapCanvas.getContext('2d');
    this.heatmapOverlayCanvas = document.getElementById(`heatmap_canvas_${this.props.id}_overlay`);
    this.heatmapOverlayCtx = this.heatmapOverlayCanvas.getContext('2d');

    this.heatmapOverlayCanvas.addEventListener('mousemove', this.onMouseMoveHeatmap.bind(this));
    this.heatmapOverlayCanvas.addEventListener('mouseup', this.onMouseUpHeatmap.bind(this), false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allTimeSeries !== this.props.allTimeSeries) {
      this.drawData(nextProps);
    }
    this.drawSelectedCluster(nextProps);
  }

  onMouseMoveHeatmap(e) {
    if (this.props.selectedClusterList.length !== 0) {
      return;
    }
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.heatmapOverlayCtx.clearRect(0, 0, this.heatmapOverlayCanvas.width, this.heatmapOverlayCanvas.height);

    // draw cross line according to coordinates
    this.drawCrossLine(x, y);
  }

  onMouseUpHeatmap(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const causeIdx = Math.floor((y - this.legendWidth) / this.props.cellScale);
    const effectIdx = Math.floor((x - this.legendWidth) / this.props.cellScale);

    if ((causeIdx > 0 && effectIdx > 0) || (causeIdx < 0 && effectIdx < 0)) {
      return;
    }

    const belongCluster = this.getBelongCluster(causeIdx, effectIdx);
    selectCluster(belongCluster, this.props.positionIdx);
    this.drawSelectedCluster(this.props);
  }

  onMouseUpShape(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    selectOnePoint(Math.floor(x / this.props.scale), Math.floor(y / this.props.scale), this.props.positionIdx);
  }

  getBelongCluster(causeIdx, effectIdx) {
    if (causeIdx > 0 && effectIdx < 0) {
      return this.searchBelongCluster(causeIdx);
    }
    return this.searchBelongCluster(effectIdx);
  }

  drawSelectedCluster(props) {
    this.heatmapOverlayCtx.clearRect(0, 0, this.heatmapOverlayCanvas.width, this.heatmapOverlayCanvas.height);

    // this.heatmapOverlayCtx.strokeStyle = 'gray';
    this.heatmapOverlayCtx.strokeStyle = 'black';
    this.heatmapOverlayCtx.fillStyle = 'rgba(240,248,255,0.3)';
    this.heatmapOverlayCtx.lineWidth = 2;

    // draw heatmap and canvas
    this.heatmapOverlayCtx.beginPath();
    props.selectedClusterList.forEach((belongCluster) => {
      const startX = this.legendWidth;
      const startY = this.legendWidth + (this.clusterRangeList[belongCluster].start * props.cellScale);
      const width = this.heatmapOverlayCanvas.width - this.legendWidth;
      const height =
        (this.clusterRangeList[belongCluster].end - this.clusterRangeList[belongCluster].start) * props.cellScale;

      this.heatmapOverlayCtx.fillRect(startX, startY, width, height);
      this.heatmapOverlayCtx.fillRect(startY, startX, height, width);
      this.heatmapOverlayCtx.rect(startX, startY, width, height);
      this.heatmapOverlayCtx.rect(startY, startX, height, width);

      this.heatmapOverlayCtx.stroke();
      this.heatmapOverlayCtx.closePath();
    });
  }

  searchBelongCluster(selectedIdx) {
    let sum = 0;
    for (let i = 0; i < this.nClusterList.length; i += 1) {
      sum += this.nClusterList[i];
      if (selectedIdx < sum) {
        return i;
      }
    }
    return this.nClusterList.length - 1;
  }

  drawCrossLine(x, y) {
    this.heatmapOverlayCtx.strokeStyle = 'black';
    this.heatmapOverlayCtx.beginPath();
    this.heatmapOverlayCtx.moveTo(this.legendWidth, y);
    this.heatmapOverlayCtx.lineTo(this.heatmapOverlayCanvas.width, y);
    this.heatmapOverlayCtx.moveTo(x, this.legendWidth);
    this.heatmapOverlayCtx.lineTo(x, this.heatmapOverlayCanvas.height);
    this.heatmapOverlayCtx.closePath();
    this.heatmapOverlayCtx.stroke();
  }

  isOnLegend(causeIdx, effectIdx) {
    if (causeIdx < 0 || effectIdx < 0) {
      return true;
    }
    return false;
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

    this.heatmapCanvas.width = (this.graphSorted.length * props.cellScale) + this.legendWidth;
    this.heatmapCanvas.height = (this.graphSorted.length * props.cellScale) + this.legendWidth;
    this.heatmapOverlayCanvas.width = this.heatmapCanvas.width;
    this.heatmapOverlayCanvas.height = this.heatmapCanvas.height;

    this.clusterRangeList = props.clusterRangeList;
    // draw heatmap and fill canvas
    let clusterIdx = 0;
    this.graphSorted.forEach((row, rowIdx) => {
      if (rowIdx >= this.clusterRangeList[clusterIdx].end) {
        clusterIdx += 1;
      }

      // draw row color to the heatmap
      // this.heatmapCtx.fillStyle = color[clusterIdx];
      this.heatmapCtx.fillStyle = 'gray';
      row.forEach((cell, cellIdx) => {
        if (cell === true) {
          this.heatmapCtx.fillRect(
            (cellIdx * props.cellScale) + this.legendWidth,
            (rowIdx * props.cellScale) + this.legendWidth,
            props.cellScale,
            props.cellScale);
        }
      });
    });

    // draw line and legend to the heat map
    drawingTool.drawFrame(this.heatmapCanvas, this.heatmapCtx);
    this.heatmapCtx.strokeStyle = 'black';
    this.heatmapCtx.lineWidth = 0.5;
    this.heatmapCtx.beginPath();
    let heatmapCtxX = this.legendWidth - 1;
    this.nClusterList.forEach((nCluster, idx) => {
      // draw legend
      this.heatmapCtx.fillStyle = color[idx];
      this.heatmapCtx.fillRect(heatmapCtxX, 0, nCluster * props.cellScale, this.legendWidth);
      this.heatmapCtx.fillRect(0, heatmapCtxX, this.legendWidth, nCluster * props.cellScale);

      // draw line
      heatmapCtxX += nCluster * props.cellScale;
      this.heatmapCtx.moveTo(heatmapCtxX, this.legendWidth);
      this.heatmapCtx.lineTo(heatmapCtxX, this.heatmapCanvas.height);

      this.heatmapCtx.moveTo(this.legendWidth, heatmapCtxX);
      this.heatmapCtx.lineTo(this.heatmapCanvas.width, heatmapCtxX);
    });
    this.heatmapCtx.closePath();
    this.heatmapCtx.stroke();
  }

  render() {
    return (
      <div>
        <div style={this.props.style}>
          <canvas id={`heatmap_canvas_${this.props.id}`} style={{ position: 'absolute', zIndex: 1 }} />
          <canvas id={`heatmap_canvas_${this.props.id}_overlay`} style={{ position: 'absolute', zIndex: 2 }} />
        </div>
      </div>
    );
  }
}

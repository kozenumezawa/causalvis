import React from 'react';

import { selectOnePoint } from '../../../intents/intent';
import * as drawingTool from '../../../utils/drawing-tool';

export default class ClusterMatrix extends React.Component {
  constructor(props) {
    super(props);

    this.legendWidth = 15;
  }

  componentDidMount() {
    this.clusterCanvas = document.getElementById(`cluster_canvas_${this.props.id}`);
    this.clusterCtx = this.clusterCanvas.getContext('2d');
    this.clusterOverlayCanvas = document.getElementById(`cluster_canvas_${this.props.id}_overlay`);
    this.clusterOverlayCtx = this.clusterOverlayCanvas.getContext('2d');

    this.clusterOverlayCanvas.addEventListener('mouseup', this.onMouseUpShape.bind(this), false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allTimeSeries !== this.props.allTimeSeries) {
      this.drawData(nextProps);
    }
    this.drawSelectedCluster(nextProps);
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
    this.clusterOverlayCtx.clearRect(0, 0, this.clusterOverlayCanvas.width, this.clusterOverlayCanvas.height);
    this.clusterOverlayCtx.fillStyle = 'black';
    // draw heatmap and canvas
    props.selectedClusterList.forEach((belongCluster) => {
      for (let cellIdx = this.clusterRangeList[belongCluster].start;
        cellIdx < this.clusterRangeList[belongCluster].end;
        cellIdx++) {
        const x = this.clusterSampledCoords[cellIdx].x * props.scale;
        const y = this.clusterSampledCoords[cellIdx].y * props.scale;
        const sideLength = props.meanStep * props.scale;
        const r = (props.meanStep - 1) * props.scale / 2;
        this.clusterOverlayCtx.fillRect(x - r, y - r, sideLength, sideLength);
      }
    });
  }

  searchBelongCluster(selectedIdx) {
    let sum = 0;
    for (let i = 0; i < this.nClusterList.length; i++) {
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

  drawCausalArrowToCanvas(causeIdx, effectIdx) {
    this.clusterOverlayCtx.clearRect(0, 0, this.clusterOverlayCanvas.width, this.clusterOverlayCanvas.height);
    const sideLength = this.props.meanStep * this.props.scale;
    const r = (this.props.meanStep - 1) * this.props.scale / 2;

    this.clusterOverlayCtx.fillStyle = 'black';
    const causeX = this.clusterSampledCoords[causeIdx].x * this.props.scale;
    const causeY = this.clusterSampledCoords[causeIdx].y * this.props.scale;
    this.clusterOverlayCtx.fillRect(causeX - r, causeY - r, sideLength, sideLength);

    this.clusterOverlayCtx.fillStyle = 'gray';
    const effectX = this.clusterSampledCoords[effectIdx].x * this.props.scale;
    const effectY = this.clusterSampledCoords[effectIdx].y * this.props.scale;
    this.clusterOverlayCtx.fillRect(effectX - r, effectY - r, sideLength, sideLength);

    if (this.graphSorted[causeIdx][effectIdx] === true) {
      this.clusterOverlayCtx.beginPath();
      this.clusterOverlayCtx.fillStyle = 'white';
      this.arrow(this.clusterOverlayCtx, causeX, causeY, effectX, effectY, [0, 3, -20, 3, -20, 12]);
      this.clusterOverlayCtx.fill();
      // this.clusterOverlayCtx.closePath();
    }
  }

  drawData(props) {
    if (props.filterAllTimeSeries == null) {
      return;
    }
    // draw heatmap and canvas according to the graph
    this.graphSorted = props.clusterMatrix;
    this.nClusterList = props.nClusterList;
    this.clusterSampledCoords = props.clusterSampledCoords;

    const color = drawingTool.getColorCategory(this.nClusterList.length);

    // draw a canvas
    this.clusterCanvas.width = props.width * props.scale;
    this.clusterCanvas.height = props.allTimeSeries.length / props.width * props.scale;
    drawingTool.drawFrame(this.clusterCanvas, this.clusterCtx);
    this.clusterOverlayCanvas.width = this.clusterCanvas.width;
    this.clusterOverlayCanvas.height = this.clusterCanvas.height;

    this.clusterRangeList = props.clusterRangeList;
    // draw heatmap and fill canvas
    let clusterIdx = 0;
    this.graphSorted.forEach((row, rowIdx) => {
      if (rowIdx >= this.clusterRangeList[clusterIdx].end) {
        clusterIdx++;
      }

      // draw the canvas according to the cluster
      this.clusterCtx.fillStyle = color[clusterIdx];

      const x = this.clusterSampledCoords[rowIdx].x * props.scale;
      const y = this.clusterSampledCoords[rowIdx].y * props.scale;
      const sideLength = props.meanStep * props.scale;
      const r = (props.meanStep - 1) * props.scale / 2;
      this.clusterCtx.fillRect(x - r, y - r, sideLength, sideLength);
    });
  }

  sum(arr) {
    return arr.reduce((prev, current) => {
      return prev + current;
    });
  }

  // ref: http://qiita.com/frogcat/items/2f94b095b4c2d8581ff6
  arrow(ctx, startX, startY, endX, endY, controlPoints) {
    const dx = endX - startX;
    const dy = endY - startY;
    const len = Math.sqrt(dx * dx + dy * dy);
    const sin = dy / len;
    const cos = dx / len;
    const a = [];
    a.push(0, 0);
    for (let i = 0; i < controlPoints.length; i += 2) {
      const x = controlPoints[i];
      const y = controlPoints[i + 1];
      a.push(x < 0 ? len + x : x, y);
    }
    a.push(len, 0);
    for (let i = controlPoints.length; i > 0; i -= 2) {
      const x = controlPoints[i - 2];
      const y = controlPoints[i - 1];
      a.push(x < 0 ? len + x : x, -y);
    }
    a.push(0, 0);
    for (let i = 0; i < a.length; i += 2) {
      const x = a[i] * cos - a[i + 1] * sin + startX;
      const y = a[i] * sin + a[i + 1] * cos + startY;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
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

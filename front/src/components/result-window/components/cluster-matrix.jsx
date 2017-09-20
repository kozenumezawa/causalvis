import React from 'react';

import { selectCluster } from '../../../intents/intent';
import * as drawingTool from '../../../utils/drawing-tool';

import OriginalCanvas from './original-canvas.jsx';
import NetworkView from './network-view.jsx';
import GraphContainer from './graph-container.jsx';
import DetailGraphContainer from './detail-graph-container.jsx';
import DetailShapeView from './detail-shape-view.jsx';

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

    const causeIdx = Math.floor((y - this.legendWidth) / this.props.cellScale);
    const effectIdx = Math.floor((x - this.legendWidth) / this.props.cellScale);

    if (this.isOnLegend(causeIdx, effectIdx)) {
      return;
    }

    this.drawCausalArrowToCanvas(causeIdx, effectIdx);
  }

  onMouseUpHeatmap(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const causeIdx = Math.floor((y - this.legendWidth) / this.props.cellScale);
    const effectIdx = Math.floor((x - this.legendWidth) / this.props.cellScale);

    if (causeIdx > 0 && effectIdx > 0 || causeIdx < 0 && effectIdx < 0) {
      return;
    }

    const belongCluster = this.getBelongCluster(causeIdx, effectIdx);
    selectCluster(belongCluster, this.props.positionIdx);
    this.drawSelectedCluster(this.props);
  }

  getBelongCluster(causeIdx, effectIdx) {
    if (causeIdx > 0 && effectIdx < 0) {
      return this.searchBelongCluster(causeIdx);
    }
    return this.searchBelongCluster(effectIdx);
  }

  drawSelectedCluster(props) {
    this.heatmapOverlayCtx.clearRect(0, 0, this.heatmapOverlayCanvas.width, this.heatmapOverlayCanvas.height);
    this.clusterOverlayCtx.clearRect(0, 0, this.clusterOverlayCanvas.width, this.clusterOverlayCanvas.height);

    this.clusterOverlayCtx.fillStyle = 'gray';
    this.heatmapOverlayCtx.strokeStyle = 'gray';
    this.heatmapOverlayCtx.fillStyle = 'rgba(240,248,255,0.5)';
    this.heatmapOverlayCtx.lineWidth = 3;

    // draw heatmap and canvas
    this.heatmapOverlayCtx.beginPath();
    props.selectedClusterList.forEach((belongCluster) => {
      const startX = this.legendWidth;
      const startY = this.legendWidth + this.clusterRangeList[belongCluster].start * props.cellScale;
      const width = this.heatmapOverlayCanvas.width - this.legendWidth;
      const height = (this.clusterRangeList[belongCluster].end - this.clusterRangeList[belongCluster].start) * props.cellScale;

      this.heatmapOverlayCtx.fillRect(startX, startY, width, height);
      this.heatmapOverlayCtx.fillRect(startY, startX, height, width);
      this.heatmapOverlayCtx.rect(startX, startY, width, height);
      this.heatmapOverlayCtx.rect(startY, startX, height, width);

      this.heatmapOverlayCtx.stroke();
      this.heatmapOverlayCtx.closePath();

      for (let cellIdx = this.clusterRangeList[belongCluster].start; cellIdx < this.clusterRangeList[belongCluster].end; cellIdx++) {
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
    // this.clusterCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.clusterCanvas.width, this.clusterCanvas.height);

    this.heatmapCanvas.width = this.graphSorted.length * props.cellScale + this.legendWidth;
    this.heatmapCanvas.height = this.graphSorted.length * props.cellScale + this.legendWidth;
    this.heatmapOverlayCanvas.width = this.heatmapCanvas.width;
    this.heatmapOverlayCanvas.height = this.heatmapCanvas.height;

    this.heatmapCanvas.style.left = `${this.clusterCanvas.width}px`;
    this.heatmapOverlayCanvas.style.left = `${this.clusterCanvas.width}px`;

    this.clusterRangeList = props.clusterRangeList;
    // draw heatmap and fill canvas
    let clusterIdx = 0;
    this.graphSorted.forEach((row, rowIdx) => {
      if (rowIdx >= this.clusterRangeList[clusterIdx].end) {
        clusterIdx++;
      }

      // draw row color to the heatmap
      this.heatmapCtx.fillStyle = color[clusterIdx];
      row.forEach((cell, cellIdx) => {
        if (cell === true) {
          this.heatmapCtx.fillRect(cellIdx * props.cellScale + this.legendWidth, rowIdx * props.cellScale + this.legendWidth, props.cellScale, props.cellScale);
        }
      });

      // draw the canvas according to the cluster
      this.clusterCtx.fillStyle = color[clusterIdx];

      const x = this.clusterSampledCoords[rowIdx].x * props.scale;
      const y = this.clusterSampledCoords[rowIdx].y * props.scale;
      const sideLength = props.meanStep * props.scale;
      const r = (props.meanStep - 1) * props.scale / 2;
      this.clusterCtx.fillRect(x - r, y - r, sideLength, sideLength);
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

    // 因果関係を表すcausal matrixを生成
    // const causalMatrix = [];
    // this.nClusterList.forEach((nCluster, rowClusterIdx) => {
    //   causalMatrix.push([]);
    //   const rowRange = clusterRangeList[rowClusterIdx];
    //
    //   clusterRangeList.forEach((range, colClusterIdx) => {
    //     if (rowClusterIdx === colClusterIdx) {
    //       causalMatrix[rowClusterIdx][colClusterIdx] = 0;
    //       return;
    //     }
    //     const colRange = range;
    //     let causalCnt = 0;
    //     for (let rowIdx = rowRange.start; rowIdx < rowRange.end; rowIdx++) {
    //       for (let colIdx = colRange.start; colIdx < colRange.end; colIdx++) {
    //         if (this.graphSorted[rowIdx][colIdx] === true) {
    //           causalCnt++;
    //         }
    //       }
    //     }
    //
    //     const area = nCluster * this.nClusterList[colClusterIdx];
    //     if (causalCnt > area / 2.5) {
    //       causalMatrix[rowClusterIdx][colClusterIdx] = 1;
    //     } else {
    //       causalMatrix[rowClusterIdx][colClusterIdx] = 0;
    //     }
    //   });
    // });
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
      <div style={{ height: 400 }} >
        <DetailShapeView
          {...this.props}
          selectedCluster={this.props.selectedClusterList[0]}
        />
        <GraphContainer
          dataContainer={this.props.selectedTimeSeriesList.averageData}
        />
        <DetailGraphContainer
          dataContainer={this.props.selectedTimeSeriesList.rawData}
        />
        {/*<NetworkView*/}
          {/*network={this.props.network}*/}
          {/*positionIdx={this.props.positionIdx}*/}
        {/*/>*/}
        {/*<OriginalCanvas*/}
          {/*id={this.props.id}*/}
          {/*allTimeSeries={this.props.allTimeSeries}*/}
          {/*width={this.props.width}*/}
          {/*scale={this.props.scale}*/}
        {/*/>*/}

        <span style={{ marginRight: 20 }} />
        <div style={{ position: 'relative', display: 'inline' }}>
          <canvas id={`cluster_canvas_${this.props.id}`} style={{ position: 'absolute', zIndex: 1 }} />
          <canvas id={`cluster_canvas_${this.props.id}_overlay`} style={{ position: 'absolute', zIndex: 2, left: 0 }} />
        </div>

        <span style={{ marginRight: 20 }} />
        <div style={{ position: 'relative', display: 'inline' }}>
          <canvas id={`heatmap_canvas_${this.props.id}`} style={{ position: 'absolute', zIndex: 1 }} />
          <canvas id={`heatmap_canvas_${this.props.id}_overlay`} style={{ position: 'absolute', zIndex: 2 }} />
        </div>
      </div>
    );
  }
}

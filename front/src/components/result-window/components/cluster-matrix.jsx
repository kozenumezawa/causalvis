import React from 'react';

import { SELECT_CLUSTER, SELECT_CELL } from '../../../constants/general-constants';

import * as drawingTool from '../../../utils/drawing-tool';


import OriginalCanvas from './canvas/original-canvas.jsx';

export default class ClusterMatrix extends React.Component {
  constructor(props) {
    super(props);

    this.legendWidth = 15;
    this.selectedClusterList = [];
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
    this.drawData(nextProps);
  }

  onMouseMoveHeatmap(e) {
    if (this.selectedClusterList.length !== 0) {
      return;
    }
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.heatmapOverlayCtx.strokeStyle = 'black';

    this.heatmapOverlayCtx.clearRect(0, 0, this.heatmapOverlayCanvas.width, this.heatmapOverlayCanvas.height);
    this.heatmapOverlayCtx.beginPath();

    this.heatmapOverlayCtx.moveTo(this.legendWidth, y);
    this.heatmapOverlayCtx.lineTo(this.heatmapOverlayCanvas.width, y);

    this.heatmapOverlayCtx.moveTo(x, this.legendWidth);
    this.heatmapOverlayCtx.lineTo(x, this.heatmapOverlayCanvas.height);

    this.heatmapOverlayCtx.closePath();
    this.heatmapOverlayCtx.stroke();

    const causeIdx = Math.floor((y - this.legendWidth) / this.props.cellScale);
    const effectIdx = Math.floor((x - this.legendWidth) / this.props.cellScale);

    if (causeIdx < 0 || effectIdx < 0) {
      return;
    }

    this.clusterOverlayCtx.clearRect(0, 0, this.clusterOverlayCanvas.width, this.clusterOverlayCanvas.height);
    this.clusterOverlayCtx.fillStyle = 'black';
    const causeX = this.clusterSampledCoords[causeIdx].x * this.props.scale;
    const causeY = this.clusterSampledCoords[causeIdx].y * this.props.scale;
    this.clusterOverlayCtx.fillRect(causeX - 1, causeY - 1, this.meanStep * this.props.scale, this.meanStep * this.props.scale);

    this.clusterOverlayCtx.fillStyle = 'gray';
    const effectX = this.clusterSampledCoords[effectIdx].x * this.props.scale;
    const effectY = this.clusterSampledCoords[effectIdx].y * this.props.scale;
    this.clusterOverlayCtx.fillRect(effectX - 1, effectY - 1, this.meanStep * this.props.scale, this.meanStep * this.props.scale);

    if (this.graphSorted[causeIdx][effectIdx] === true) {
      this.clusterOverlayCtx.beginPath();
      this.clusterOverlayCtx.fillStyle = 'white';
      this.arrow(this.clusterOverlayCtx, causeX, causeY, effectX, effectY, [0, 3, -20, 3, -20, 12]);
      this.clusterOverlayCtx.fill();
      // this.clusterOverlayCtx.closePath();
    }
  }

  onMouseUpHeatmap(e) {
    this.heatmapOverlayCtx.clearRect(0, 0, this.heatmapOverlayCanvas.width, this.heatmapOverlayCanvas.height);
    this.clusterOverlayCtx.clearRect(0, 0, this.clusterOverlayCanvas.width, this.clusterOverlayCanvas.height);

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const causeIdx = Math.floor((y - this.legendWidth) / this.props.cellScale);
    const effectIdx = Math.floor((x - this.legendWidth) / this.props.cellScale);

    if (causeIdx > 0 && effectIdx > 0 || causeIdx < 0 && effectIdx < 0) {
      return;
    }

    this.clusterOverlayCtx.fillStyle = 'gray';
    this.heatmapOverlayCtx.strokeStyle = 'gray';
    this.heatmapOverlayCtx.fillStyle = 'rgba(240,248,255,0.5)';

    this.heatmapOverlayCtx.lineWidth = 3;
    this.heatmapOverlayCtx.beginPath();

    let belongCluster = 0;
    if (causeIdx > 0 && effectIdx < 0) {
      belongCluster = this.getBelongCluster(causeIdx);
    } else {
      belongCluster = this.getBelongCluster(effectIdx);
    }

    if (this.selectedClusterList.indexOf(belongCluster) === -1) {
      this.selectedClusterList.push(belongCluster);
    } else {
      this.selectedClusterList = this.selectedClusterList.filter((clusterNumber) => {
        return (clusterNumber !== belongCluster);
      });
    }

    this.selectedClusterList.forEach((belongCluster) => {
      const startX = this.legendWidth;
      const startY = this.legendWidth + this.clusterRangeList[belongCluster].start * this.props.cellScale;
      const width = this.heatmapOverlayCanvas.width - this.legendWidth;
      const height = (this.clusterRangeList[belongCluster].end - this.clusterRangeList[belongCluster].start) * this.props.cellScale;

      this.heatmapOverlayCtx.fillRect(startX, startY, width, height);
      this.heatmapOverlayCtx.fillRect(startY, startX, height, width);
      this.heatmapOverlayCtx.rect(startX, startY, width, height);
      this.heatmapOverlayCtx.rect(startY, startX, height, width);

      this.heatmapOverlayCtx.stroke();
      this.heatmapOverlayCtx.closePath();

      for (let cellIdx = this.clusterRangeList[belongCluster].start; cellIdx < this.clusterRangeList[belongCluster].end; cellIdx++) {
        const x = this.clusterSampledCoords[cellIdx].x * this.props.scale;
        const y = this.clusterSampledCoords[cellIdx].y * this.props.scale;
        this.clusterOverlayCtx.fillRect(x - 1, y - 1, this.meanStep * this.props.scale, this.meanStep * this.props.scale);
      }
    });
  }

  getBelongCluster(selectedIdx) {
    let sum = 0;
    for (let i = 0; i < this.nClusterList.length; i++) {
      sum += this.nClusterList[i];
      if (selectedIdx < sum) {
        return i;
      }
    }
    return this.nClusterList.length - 1;
  }

  drawData(props) {
    if (props.filterAllTimeSeries == null) {
      return;
    }

    // draw heatmap and canvas according to the graph
    this.graphSorted = props.clusterMatrix;
    this.nClusterList = props.nClusterList;
    this.clusterSampledCoords = props.clusterSampledCoords;
    this.meanStep = props.meanR * 2 + 1;

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

    // save start and stop index of each cluster
    this.clusterRangeList = [];
    this.nClusterList.reduce((prev, current) => {
      const endPixel = prev + current;
      this.clusterRangeList.push({
        start: prev,
        end: endPixel,
      });
      return endPixel;
    }, 0);

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
      this.clusterCtx.fillRect(x - 1, y - 1, this.meanStep * props.scale, this.meanStep * props.scale);
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
      <div style={{ height: 300 }} >
        <OriginalCanvas
          id={this.props.id}
          allTimeSeries={this.props.allTimeSeries}
          width={this.props.width}
          scale={this.props.scale}
        />

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

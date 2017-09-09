import React from 'react';

import * as drawingTool from '../../../utils/drawing-tool';

import OriginalCanvas from './canvas/original-canvas.jsx';

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
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  onMouseMoveHeatmap(e) {
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

    const causeIdx = y - this.legendWidth;
    const effectIdx = x - this.legendWidth;

    if (causeIdx < 0 || effectIdx < 0) {
      return;
    }

    console.log(this.clusterSampledCoords[causeIdx]);
  }

  drawData(props) {
    if (props.filterAllTimeSeries == null) {
      return;
    }

    const meanStep = props.meanR * 2 + 1;

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


    const cellSize = 0.5 * props.scale / 2;

    this.heatmapCanvas.width = this.graphSorted.length * cellSize + this.legendWidth;
    this.heatmapCanvas.height = this.graphSorted.length * cellSize + this.legendWidth;
    this.heatmapOverlayCanvas.width = this.heatmapCanvas.width;
    this.heatmapOverlayCanvas.height = this.heatmapCanvas.height;

    this.heatmapCanvas.style.left = `${this.clusterCanvas.width}px`;
    this.heatmapOverlayCanvas.style.left = `${this.clusterCanvas.width}px`;

    // save start and stop index of each cluster
    const clusterRangeList = [];
    this.nClusterList.reduce((prev, current) => {
      const endPixel = prev + current;
      clusterRangeList.push({
        start: prev,
        end: endPixel,
      });
      return endPixel;
    }, 0);

    // draw heatmap and fill canvas
    let clusterIdx = 0;
    this.graphSorted.forEach((row, rowIdx) => {
      if (rowIdx >= clusterRangeList[clusterIdx].end) {
        clusterIdx++;
      }

      // draw row color to the heatmap
      this.heatmapCtx.fillStyle = color[clusterIdx];
      row.forEach((cell, cellIdx) => {
        if (cell === true) {
          this.heatmapCtx.fillRect(cellIdx * cellSize + this.legendWidth, rowIdx * cellSize + this.legendWidth, cellSize, cellSize);
        }
      });

      // draw the canvas according to the cluster
      this.clusterCtx.fillStyle = color[clusterIdx];

      const x = this.clusterSampledCoords[rowIdx].x * props.scale;
      const y = this.clusterSampledCoords[rowIdx].y * props.scale;
      this.clusterCtx.fillRect(x - 1, y - 1, meanStep * props.scale, meanStep * props.scale);
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
      this.heatmapCtx.fillRect(heatmapCtxX, 0, nCluster * cellSize, this.legendWidth);
      this.heatmapCtx.fillRect(0, heatmapCtxX, this.legendWidth, nCluster * cellSize);

      // draw line
      heatmapCtxX += nCluster * cellSize;
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

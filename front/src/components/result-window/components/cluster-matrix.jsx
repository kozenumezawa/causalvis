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

    this.heatmapCanvas = document.getElementById(`heatmap_canvas_${this.props.id}`);
    this.heatmapCtx = this.heatmapCanvas.getContext('2d');
    this.heatmapCanvasOverlay = document.getElementById(`heatmap_canvas_${this.props.id}_overlay`);

    this.heatmapCanvas.addEventListener('mousemove', this.onMouseMoveHeatmap.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  onMouseMoveHeatmap(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  }

  drawData(props) {
    if (props.filterAllTimeSeries == null) {
      return;
    }

    const meanStep = props.meanR * 2 + 1;

    // draw heatmap and canvas according to the graph
    const graphSorted = props.clusterMatrix;
    const nClusterList = props.nClusterList;
    const clusterSampledCoords = props.clusterSampledCoords;
    const color = drawingTool.getColorCategory(nClusterList.length);

    // draw a canvas
    this.clusterCanvas.width = props.width * props.scale;
    this.clusterCanvas.height = props.allTimeSeries.length / props.width * props.scale;
    drawingTool.drawFrame(this.clusterCanvas, this.clusterCtx);
    // this.clusterCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.clusterCanvas.width, this.clusterCanvas.height);


    const cellSize = 0.5 * props.scale / 2;

    this.heatmapCanvas.width = graphSorted.length * cellSize + this.legendWidth;
    this.heatmapCanvas.height = graphSorted.length * cellSize + this.legendWidth;
    this.heatmapCanvasOverlay.width = this.heatmapCanvas.width;
    this.heatmapCanvasOverlay.height = this.heatmapCanvas.height;

    // save start and stop index of each cluster
    const clusterRangeList = [];
    nClusterList.reduce((prev, current) => {
      const endPixel = prev + current;
      clusterRangeList.push({
        start: prev,
        end: endPixel,
      });
      return endPixel;
    }, 0);

    // draw heatmap and fill canvas
    let clusterIdx = 0;
    graphSorted.forEach((row, rowIdx) => {
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

      const x = clusterSampledCoords[rowIdx].x * props.scale;
      const y = clusterSampledCoords[rowIdx].y * props.scale;
      this.clusterCtx.fillRect(x - 1, y - 1, meanStep * props.scale, meanStep * props.scale);
    });

    // draw line and legend to the heat map
    drawingTool.drawFrame(this.heatmapCanvas, this.heatmapCtx);
    this.heatmapCtx.line_color = 'black';
    this.heatmapCtx.lineWidth = 0.5;
    this.heatmapCtx.beginPath();
    let heatmapCtxX = this.legendWidth - 1;
    nClusterList.forEach((nCluster, idx) => {
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
    // nClusterList.forEach((nCluster, rowClusterIdx) => {
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
    //         if (graphSorted[rowIdx][colIdx] === true) {
    //           causalCnt++;
    //         }
    //       }
    //     }
    //
    //     const area = nCluster * nClusterList[colClusterIdx];
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
      <div style={{ position: 'relative', height: 300 }}>
        <OriginalCanvas
          id={this.props.id}
          allTimeSeries={this.props.allTimeSeries}
          width={this.props.width}
          scale={this.props.scale}
        />
        <span style={{ marginRight: 20 }} />
        <canvas id={`cluster_canvas_${this.props.id}`} />
        <span style={{ marginRight: 20 }} />
        <canvas id={`heatmap_canvas_${this.props.id}`} style={{ position: 'absolute', zIndex: 1 }} />
        <canvas id={`heatmap_canvas_${this.props.id}_overlay`} style={{ position: 'absolute', zIndex: 2 }} />
      </div>
    );
  }
}

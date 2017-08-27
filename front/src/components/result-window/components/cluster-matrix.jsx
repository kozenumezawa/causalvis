import React from 'react';

import * as drawingTool from '../../../utils/drawing-tool';

export default class ClusterMatrix extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mean_step: 3,
    };
    this.scale = 3;
  }

  componentDidMount() {
    this.canvas = document.getElementById('cluster_canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 300;
    this.canvas.height = 300;
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  drawData(props) {
    if (props.allTiffList.length === 0) {
      return;
    }

    const canvas = props.allTiffList[0];

    // draw heatmap and canvas according to the graph
    window.fetch('trp3_graph_sorted.json')
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const graphSorted = json.data;
        const nClusterList = json.n_cluster_list;
        const ordering = json.ordering;
        const notIsolatedList = json.not_isolated_list;

        const color = drawingTool.getColorCategory(nClusterList.length);

        // draw a canvas
        this.canvas.width = canvas.width * this.scale;
        this.canvas.height = canvas.height * this.scale;
        this.ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, this.canvas.width, this.canvas.height);

        const heatmapCanvas = document.getElementById('heatmap_canvas');
        const heatmapCtx = heatmapCanvas.getContext('2d');

        const cellSize = 1;
        const legendWidth = 15;
        heatmapCanvas.width = graphSorted.length * cellSize + legendWidth;
        heatmapCanvas.height = graphSorted.length * cellSize + legendWidth;

        // Save the index of sampling points
        const samplingIdxList = [];
        const coordSamplingPoints = [];
        let notIsolatedListIdx = 0;
        let samplingPointIdx = 0;
        props.allTimeSeries.forEach((timeSeries, idx) => {
          if (this.sum(timeSeries) !== 0 && this.isSamplingPoint(idx, canvas.width)) {
            if (samplingPointIdx++ === notIsolatedList[notIsolatedListIdx]) {
              samplingIdxList.push(idx);
              const x = idx % canvas.width * this.scale;
              const y = Math.floor(idx / canvas.width) * this.scale;
              coordSamplingPoints.push([x, y]);
              notIsolatedListIdx++;
            }
          }
        });

        // 各クラスターのstartとstopのindexを保存
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
          heatmapCtx.fillStyle = color[clusterIdx];
          row.forEach((cell, cellIdx) => {
            if (cell === true) {
              heatmapCtx.fillRect(cellIdx * cellSize + legendWidth, rowIdx * cellSize + legendWidth, cellSize, cellSize);
            }
          });

          // draw the canvas according to the cluster
          this.ctx.fillStyle = color[clusterIdx];
          const samplingIdx = ordering.indexOf(rowIdx); // ordering.indexOf(rowIdx) = the index before clustering.
          const x = coordSamplingPoints[samplingIdx][0];
          const y = coordSamplingPoints[samplingIdx][1];
          this.ctx.fillRect(x - 1, y - 1, this.state.mean_step * this.scale, this.state.mean_step * this.scale);
        });

        // draw line and legend to the heat map
        drawingTool.drawFrame(heatmapCanvas, heatmapCtx);
        heatmapCtx.line_color = 'black';
        heatmapCtx.lineWidth = 1;
        heatmapCtx.beginPath();
        let heatmapCtxX = legendWidth - 1;
        nClusterList.forEach((nCluster, idx) => {
          // draw legend
          heatmapCtx.fillStyle = color[idx];
          heatmapCtx.fillRect(heatmapCtxX, 0, nCluster * cellSize, legendWidth);
          heatmapCtx.fillRect(0, heatmapCtxX, legendWidth, nCluster * cellSize);

          // draw line
          heatmapCtxX += nCluster * cellSize;
          heatmapCtx.moveTo(heatmapCtxX, legendWidth);
          heatmapCtx.lineTo(heatmapCtxX, heatmapCanvas.height);

          heatmapCtx.moveTo(legendWidth, heatmapCtxX);
          heatmapCtx.lineTo(heatmapCanvas.width, heatmapCtxX);
        });
        heatmapCtx.closePath();
        heatmapCtx.stroke();


        // 因果関係を表すcausal matrixを生成
        const causalMatrix = [];
        nClusterList.forEach((nCluster, rowClusterIdx) => {
          causalMatrix.push([]);
          const rowRange = clusterRangeList[rowClusterIdx];

          clusterRangeList.forEach((range, colClusterIdx) => {
            if (rowClusterIdx === colClusterIdx) {
              causalMatrix[rowClusterIdx][colClusterIdx] = 0;
              return;
            }
            const colRange = range;
            let causalCnt = 0;
            for (let rowIdx = rowRange.start; rowIdx < rowRange.end; rowIdx++) {
              for (let colIdx = colRange.start; colIdx < colRange.end; colIdx++) {
                if (graphSorted[rowIdx][colIdx] === true) {
                  causalCnt++;
                }
              }
            }

            const area = nCluster * nClusterList[colClusterIdx];
            if (causalCnt > area / 2.5) {
              causalMatrix[rowClusterIdx][colClusterIdx] = 1;
            } else {
              causalMatrix[rowClusterIdx][colClusterIdx] = 0;
            }
          });
        });
      });
  }

  isSamplingPoint(idx, width) {
    const x = idx % width;
    const y = Math.floor(idx / width);
    if (x % this.state.mean_step === 1 && y % this.state.mean_step === 0) {
      return true;
    }
    return false;
  }

  sum(arr) {
    return arr.reduce((prev, current) => {
      return prev + current;
    });
  }

  render() {
    return (
      <div>
        <canvas id="cluster_canvas" />
        <canvas id="heatmap_canvas" />
      </div>
    );
  }
}

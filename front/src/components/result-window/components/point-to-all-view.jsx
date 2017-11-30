import React from 'react';
import colormap from 'colormap';

import * as drawingTool from '../../../utils/drawing-tool';

export default class PointToAllView extends React.Component {
  componentDidMount() {
    this.canvas = document.getElementById(`detail_causal_shape_${this.props.id}`);
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = 200;
    this.canvas.height = 200;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pointToAllCausal.lagLists.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      drawingTool.drawFrame(this.canvas, this.ctx);
      return;
    }
    this.drawData(nextProps);
  }

  drawData(props) {
    const { clusterSampledCoords, windowSize, width, allTimeSeries, scale, pointToAllCausal } = props;
    this.canvas.width = width * scale;
    this.canvas.height = (allTimeSeries.length / width) * scale;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawingTool.drawFrame(this.canvas, this.ctx);

    const options = {
      colormap: 'RdBu',
      nshades: 60,
      format: 'rgbaString',
      alpha: [1, 1],
    };
    const colorCategory = colormap(options);

    pointToAllCausal.lagLists.forEach((lag, rowIdx) => {
      this.ctx.fillStyle = 'black';
      if (lag === false && pointToAllCausal.pointRowIdx !== rowIdx) {
        return;
      }
      if (pointToAllCausal.pointRowIdx === rowIdx) {
        this.ctx.fillStyle = 'green';
      } else {
        // if (lag < 0) {
        //   return;
        // }
        this.ctx.fillStyle = colorCategory[30 + lag];
      }
      const x = clusterSampledCoords[rowIdx].x * scale;
      const y = clusterSampledCoords[rowIdx].y * scale;
      const sideLength = windowSize * scale;
      const r = ((windowSize - 1) * scale) / 2;
      this.ctx.fillRect(x - r, y - r, sideLength, sideLength);
    });
  }

  render() {
    return (
      <canvas id={`detail_causal_shape_${this.props.id}`} style={this.props.style} />
    );
  }
}

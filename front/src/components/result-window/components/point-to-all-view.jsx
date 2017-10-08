import React from 'react';

import * as drawingTool from '../../../utils/drawing-tool';

export default class PointToAllView extends React.Component {
  componentDidMount() {
    this.canvas = document.getElementById(`detail_causal_shape_${this.props.id}`);
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = 100;
    this.canvas.height = 100;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawingTool.drawFrame(this.canvas, this.ctx);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pointToAllCausal.data.length === 0) {
      return;
    }
    this.drawData(nextProps);
  }

  drawData(props) {
    const { clusterSampledCoords, meanStep, width, allTimeSeries, scale, pointToAllCausal } = props;
    this.canvas.width = width * scale;
    this.canvas.height = (allTimeSeries.length / width) * scale;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawingTool.drawFrame(this.canvas, this.ctx);

    pointToAllCausal.data.forEach((causal, rowIdx) => {
      this.ctx.fillStyle = 'black';
      if (causal === false && pointToAllCausal.pointRowIdx !== rowIdx) {
        return;
      }
      if (pointToAllCausal.pointRowIdx === rowIdx) {
        this.ctx.fillStyle = 'red';
      }
      const x = clusterSampledCoords[rowIdx].x * scale;
      const y = clusterSampledCoords[rowIdx].y * scale;
      const sideLength = meanStep * scale;
      const r = ((meanStep - 1) * scale) / 2;
      this.ctx.fillRect(x - r, y - r, sideLength, sideLength);
    });
  }

  render() {
    return (
      <canvas id={`detail_causal_shape_${this.props.id}`} style={this.props.style} />
    );
  }
}

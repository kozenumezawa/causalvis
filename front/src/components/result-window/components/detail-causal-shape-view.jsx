import React from 'react';

import * as drawingTool from '../../../utils/drawing-tool';

export default class DetailCausalShapeView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(`detail_causal_shape_${this.props.id}`);
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  drawData(props) {
    const { clusterSampledCoords, meanStep, width, allTimeSeries, scale, pointToAllCausal } = props;
    this.canvas.width = width * scale;
    this.canvas.height = allTimeSeries.length / width * scale;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawingTool.drawFrame(this.canvas, this.ctx);

    this.ctx.fillStyle = 'black';

    pointToAllCausal.forEach((causal, rowIdx) => {
      if (causal === false) {
        return;
      }
      const x = clusterSampledCoords[rowIdx].x * scale;
      const y = clusterSampledCoords[rowIdx].y * scale;
      const sideLength = meanStep * scale;
      const r = (meanStep - 1) * scale / 2;
      this.ctx.fillRect(x - r, y - r, sideLength, sideLength);
    });
  }

  render() {
    return (
      <canvas id={`detail_causal_shape_${this.props.id}`} style={{ position: 'relative' }} />
    );
  }
}

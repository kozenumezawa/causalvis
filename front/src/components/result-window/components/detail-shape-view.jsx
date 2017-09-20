import React from 'react';

import * as drawingTool from '../../../utils/drawing-tool';

export default class DetailShapeView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.canvas = document.getElementById(`detail_shape_${this.props.id}`);
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCluster !== this.props.selectedCLuster) {
      this.drawData(nextProps);
    }
  }

  drawData(props) {
    const { selectedCluster, clusterSampledCoords, clusterRangeList, nClusterList, meanStep, width, allTimeSeries, scale } = props;
    this.canvas.width = width * scale;
    this.canvas.height = allTimeSeries.length / width * scale;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawingTool.drawFrame(this.canvas, this.ctx);

    const color = drawingTool.getColorCategory(nClusterList.length);
    this.ctx.fillStyle = color[selectedCluster];
    for (let rowIdx = clusterRangeList[selectedCluster].start; rowIdx < clusterRangeList[selectedCluster].end; rowIdx++) {
      const x = clusterSampledCoords[rowIdx].x * scale;
      const y = clusterSampledCoords[rowIdx].y * scale;
      this.ctx.fillRect(x - 1, y - 1, meanStep * scale, meanStep * scale);
    }
  }

  render() {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <canvas id={`detail_shape_${this.props.id}`} style={{ position: 'absolute', zIndex: 1 }} />
        <canvas id={`detail_shape_${this.props.id}_overlay`} style={{ position: 'absolute', zIndex: 2, left: 0 }} />
      </div>
    );
  }
}

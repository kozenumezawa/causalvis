import React from 'react';
import colormap from 'colormap';

export default class OriginalCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.scale = 2;
  }

  componentDidMount() {
    const options = {
      colormap: 'bone',
      nshades: 256,
      format: 'hex',
      alpha: 1,
    };

    this.colormap = colormap(options);

    this.canvas = document.getElementById(`original_canvas_${this.props.id}`);
    this.ctx = this.canvas.getContext('2d');
  }

  componentWillReceiveProps(nextProps) {
    this.drawData(nextProps);
  }

  drawData(props) {
    if (props.allTimeSeries == null) {
      return;
    }

    this.canvas.width = props.width * this.scale;
    this.canvas.height = props.allTimeSeries.length / props.width * this.scale;

    props.allTimeSeries.forEach((timeSeries, idx) => {
      this.ctx.fillStyle = this.colormap[timeSeries[0]];
      const x = idx % props.width * this.scale;
      const y = idx / props.width * this.scale;
      this.ctx.fillRect(x - 1, y - 1, this.scale, this.scale);
    });
  }

  render() {
    return (
      <canvas id={`original_canvas_${this.props.id}`} />
    );
  }
}

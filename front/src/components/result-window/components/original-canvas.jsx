import React from 'react';
import colormap from 'colormap';

import * as drawingTool from '../../../utils/drawing-tool';

export default class OriginalCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playIndex: 0,
    };
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

    this.drawData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allTimeSeries !== this.props.allTimeSeries) {
      if (this.playTiff != null) {
        clearInterval(this.playTiff);
      }
      this.drawData(nextProps);
    }
  }

  drawData(props) {
    if (props.allTimeSeries == null) {
      return;
    }

    this.canvas.width = props.width * props.scale;
    this.canvas.height = (props.allTimeSeries.length / props.width) * props.scale;


    // let playTimerOn = true;
    // let playIndex = 0;
    // const playTiff = setInterval(() => {
    //   if (++playIndex === props.allTimeSeries[0].length - 1 || playTimerOn === false) {
    //     playIndex = (playIndex === props.allTimeSeries[0].length - 1) ? 0 : playIndex;
    //     clearInterval(playTiff);
    //     playTimerOn = false;
    //   }
    //   props.allTimeSeries.forEach((timeSeries, idx) => {
    //     const scalar = timeSeries[playIndex];
    //     if (scalar > 0 && scalar <= 1) {
    //       this.ctx.fillStyle = this.colormap[Math.floor(scalar * 255 - 0.000001)];
    //     } else {
    //       this.ctx.fillStyle = this.colormap[scalar];
    //     }
    //
    //     const x = idx % props.width * props.scale;
    //     const y = idx / props.width * props.scale;
    //     this.ctx.fillRect(x - 1, y - 1, props.scale, props.scale);
    //   });
    //   drawingTool.drawFrame(this.canvas, this.ctx);
    // }, 50);
    this.playTiff = setInterval(() => {
      if (this.state.playIndex === props.allTimeSeries[0].length - 1) {
        this.state.playIndex = (this.state.playIndex === props.allTimeSeries[0].length - 1) ? 0 : this.state.playIndex;
      }
      props.allTimeSeries.forEach((timeSeries, idx) => {
        const scalar = timeSeries[this.state.playIndex];
        if (scalar > 0 && scalar <= 1) {
          this.ctx.fillStyle = this.colormap[Math.floor((scalar * 255) - 0.000001)];
        } else {
          this.ctx.fillStyle = this.colormap[scalar];
        }

        const x = (idx % props.width) * props.scale;
        const y = (idx / props.width) * props.scale;
        this.ctx.fillRect(x - (props.scale / 2), y - (props.scale / 2), props.scale, props.scale);
      });
      drawingTool.drawFrame(this.canvas, this.ctx);
      this.setState({ playIndex: this.state.playIndex + 1 });
    }, 50);
  }

  render() {
    const timeText = `${this.state.playIndex} / ${this.props.allTimeSeries[0].length}`;
    return (
      <div>
        <canvas id={`original_canvas_${this.props.id}`} />
        <div>
          { timeText }
        </div>
      </div>
    );
  }
}

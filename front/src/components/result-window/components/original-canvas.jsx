import React from 'react';
import colormap from 'colormap';
import { Radio, Form, Segment } from 'semantic-ui-react';

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

  handleSliderChange(e) {
    this.setState({
      playIndex: Number(e.target.value),
    });
    this.drawData(Number(e.target.value));
  }

  handleRadioChange(e, { checked }) {
    if (checked === true) {
      this.startAutoMode();
      return;
    }
    clearInterval(this.playTiff);
  }

  startAutoMode() {
    // auto mode
    this.playTiff = setInterval(() => {
      if (this.state.playIndex === this.props.allTimeSeries[0].length - 1) {
        this.state.playIndex = (this.state.playIndex === this.props.allTimeSeries[0].length - 1) ? 0 : this.state.playIndex;
      }
      this.drawData(this.state.playIndex);
      this.setState({ playIndex: this.state.playIndex + 1 });
    }, 30);
    this.drawData();
  }

  drawData(props) {
    if (props.allTimeSeries == null) {
      return;
    }

    this.canvas.width = props.width * props.scale;
    this.canvas.height = (props.allTimeSeries.length / props.width) * props.scale;

    this.playTiff = setInterval(() => {
      if (this.state.playIndex === props.allTimeSeries[0].length - 1) {
        this.state.playIndex = (this.state.playIndex === props.allTimeSeries[0].length - 1) ? 0 : this.state.playIndex;
      }
      props.allTimeSeries.forEach((timeSeries, idx) => {
        const scalar = timeSeries[this.state.playIndex];
        if (scalar > 0 && scalar <= 1) {
          this.ctx.fillStyle = this.colormap[Math.floor((scalar * 255) - 0.000001)];
        } else {
          this.ctx.fillStyle = this.colormap[Math.floor(scalar)];
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
    const timeText = `${this.state.playIndex} / ${this.props.allTimeSeries[0].length - 1}`;
    return (
      <div>
        <canvas id={`original_canvas_${this.props.id}`} />
        <div
          style={{ position: 'absolute', top: 220, left: -40, width: 330 }}
          data-intro="この部分では、動画の自動再生のON/OFFや、手動で再生時間を変えることができます。"
          data-step="6"
        >
          <Segment>
            <Form>
              <Form.Group inline>
                <label style={{ width: 110 }}>time</label>
                <input
                  type="range"
                  className="input-range"
                  min={0}
                  max={199}
                  value={this.state.playIndex}
                  onChange={this.handleSliderChange.bind(this)}
                />
                <label style={{ width: 110, marginLeft: 10 }}>
                  { timeText }
                </label>
              </Form.Group>
              <Form.Group inline>
                <label>auto mode</label>
                <Radio
                  defaultChecked
                  toggle
                  onChange={this.handleRadioChange.bind(this)}
                />
              </Form.Group>
            </Form>
          </Segment>
        </div>

      </div>
    );
  }
}

import React from 'react';

import * as drawingTool from '../../../utils/drawing-tool';

export default class PointToNearView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.canvas = document.getElementById(`point_to_detail_canvas_${this.props.id}`);
    // this.ctx = this.canvas.getContext('2d');
    //
    // this.canvas.width = 200;
    // this.canvas.height = 200;
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // drawingTool.drawFrame(this.canvas, this.ctx);
  }

  renderTable() {
    const { pointToNearCausal } = this.props;
    if (pointToNearCausal.data.length === 0) {
      return [];
    }

    const getRenderItem = (idx) => {
      if (pointToNearCausal.data[idx].fromCenter === true) {
        return 'from';
      } else if (pointToNearCausal.data[idx].toCenter === true) {
        return 'to';
      }
      return '';
    };

    return (
      <table style={{ border: '1px solid' }}>
        <tbody>
          <tr style={{ border: '1px solid' }}>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(0) }</th>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(1) }</th>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(2) }</th>
          </tr>
          <tr style={{ align: 'center', border: '1px solid' }}>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(3) }</th>
            <th style={{ width: 50, border: '1px solid' }}></th>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(5) }</th>
          </tr>
          <tr style={{ align: 'center', border: '1px solid' }}>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(6) }</th>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(7) }</th>
            <th style={{ width: 50, border: '1px solid' }}>{ getRenderItem(8) }</th>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div style={this.props.style}>
        {
          (() => {
            return this.renderTable();
          })()
        }
        {/*<canvas id={`point_to_detail_canvas_${this.props.id}`} style={this.props.style} />*/}
      </div>
    );
  }
}

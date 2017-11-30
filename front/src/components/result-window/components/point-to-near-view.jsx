import React from 'react';
import colormap from 'colormap';

export default class PointToNearView extends React.Component {
  renderTable() {
    const { pointToNearCausal } = this.props;
    if (pointToNearCausal.data.length === 0) {
      return [];
    }

    const getRenderItem = (idx) => {
      if (pointToNearCausal.data[idx].fromCenter === true) {
        return pointToNearCausal.data[idx].lagFromCenter;
      } else if (pointToNearCausal.data[idx].toCenter === true) {
        return pointToNearCausal.data[idx].lagToCenter;
      }
      return ' ';
    };

    const options = {
      colormap: 'RdBu',
      nshades: 60,
      format: 'rgbaString',
      alpha: [1, 1],
    };
    const colorCategory = colormap(options);

    return (
      <table style={{ border: '1px solid' }}>
        <tbody>
          <tr style={{ border: '1px solid' }}>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(0)] }}>{ getRenderItem(0) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(1)] }}>{ getRenderItem(1) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(2)] }}>{ getRenderItem(2) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(3)] }}>{ getRenderItem(3) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(4)] }}>{ getRenderItem(4) }</th>
          </tr>
          <tr style={{ border: '1px solid' }}>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(5)] }}>{ getRenderItem(5) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(6)] }}>{ getRenderItem(6) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(7)] }}>{ getRenderItem(7) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(8)] }}>{ getRenderItem(8) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(9)] }}>{ getRenderItem(9) }</th>
          </tr>
          <tr style={{ align: 'center', border: '1px solid' }}>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(10)] }}>{ getRenderItem(10) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(11)] }}>{ getRenderItem(11) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: 'green' }} />
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(13)] }}>{ getRenderItem(13) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(14)] }}>{ getRenderItem(14) }</th>
          </tr>
          <tr style={{ border: '1px solid' }}>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(15)] }}>{ getRenderItem(15) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(16)] }}>{ getRenderItem(16) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(17)] }}>{ getRenderItem(17) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(18)] }}>{ getRenderItem(18) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(19)] }}>{ getRenderItem(19) }</th>
          </tr>
          <tr style={{ border: '1px solid' }}>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(20)] }}>{ getRenderItem(20) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(21)] }}>{ getRenderItem(21) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(22)] }}>{ getRenderItem(22) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(23)] }}>{ getRenderItem(23) }</th>
            <th style={{ width: 40, height: 30, border: '1px solid', backgroundColor: colorCategory[30 + getRenderItem(24)] }}>{ getRenderItem(24) }</th>
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
      </div>
    );
  }
}

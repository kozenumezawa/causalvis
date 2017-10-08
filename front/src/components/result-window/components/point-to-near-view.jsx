import React from 'react';

export default class PointToNearView extends React.Component {
  renderTable() {
    const { pointToNearCausal } = this.props;
    if (pointToNearCausal.data.length === 0) {
      return [];
    }

    const getRenderItem = (idx) => {
      if (pointToNearCausal.data[idx].fromCenter === true) {
        return 'effect';
      } else if (pointToNearCausal.data[idx].toCenter === true) {
        return 'cause';
      }
      return ' ';
    };

    return (
      <table style={{ border: '1px solid' }}>
        <tbody>
          <tr style={{ border: '1px solid' }}>
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(0) }</th>
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(1) }</th>
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(2) }</th>
          </tr>
          <tr style={{ align: 'center', border: '1px solid' }}>
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(3) }</th>
            <th style={{ width: 50, height: 30, border: '1px solid' }} />
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(5) }</th>
          </tr>
          <tr style={{ align: 'center', border: '1px solid' }}>
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(6) }</th>
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(7) }</th>
            <th style={{ width: 50, height: 30, border: '1px solid' }}>{ getRenderItem(8) }</th>
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

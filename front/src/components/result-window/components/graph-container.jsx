import React from 'react';
import ReactDOM from 'react-dom';
import { Scatter } from 'react-chartjs-2';

export default class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.chart).style.display = 'inline';
  }

  render() {
    // [[{}, {},][{}, {}]]  => [{}, {},{}, {}]
    const hexToRGBA = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      if (alpha) {
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const data2DArray = this.props.rawContainer.map((data) => {
      return data.map((selectedTimeSeries) => {
        return {
          label: `${selectedTimeSeries.label}`,
          fill: false,
          borderColor: hexToRGBA(selectedTimeSeries.color, 0.4),
          pointBackgroundColor: '#fff',
          borderWidth: 0.4,
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHitRadius: 0,
          data: selectedTimeSeries.data,
        };
      });
    });

    const detailDataArray = Array.prototype.concat.apply([], data2DArray);
    const averageDataArray = this.props.dataContainer.map((selectedTimeSeries) => {
      return {
        label: `Cluster${selectedTimeSeries.label}`,
        fill: false,
        backgroundColor: `${selectedTimeSeries.color}`,
        borderColor: `${selectedTimeSeries.color}`,
        pointBorderColor: `${selectedTimeSeries.color}`,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: selectedTimeSeries.data,
      };
    });

    const chartData = {
      datasets: Array.prototype.concat.apply(detailDataArray, averageDataArray),
    };

    const options = {
      maintainAspectRatio: false,
      responsive: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time Step',
          },
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'value',
          },
        }],
      },
    };

    return (
      <Scatter
        ref="chart"
        data={chartData}
        options={options}
        width={200}
        height={200}
      />
    );
  }
}

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
    const chartData = {
      datasets: this.props.dataContainer.map((selectedTimeSeries) => {
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
      }),
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

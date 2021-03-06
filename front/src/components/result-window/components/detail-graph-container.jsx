import React from 'react';
import { Scatter } from 'react-chartjs-2';

export default class DetailGraphContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // data2DArray must be flatten to be acceptable as datasets like this:
    // [[{}, {},][{}, {}]]  => [{}, {},{}, {}]
    const data2DArray = this.props.dataContainer.map((data) => {
      return data.map((selectedTimeSeries) => {
        return {
          label: `${selectedTimeSeries.label}`,
          fill: false,
          borderColor: `${selectedTimeSeries.color}`,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 0,
          pointHitRadius: 0,
          data: selectedTimeSeries.data,
        };
      });
    });

    const data1DArray = Array.prototype.concat.apply([], data2DArray);
    const chartData = {
      datasets: data1DArray,
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
        ref={(ref) => { this.chart = ref; }}
        data={chartData}
        options={options}
        width={200}
        height={200}
      />
    );
  }
}

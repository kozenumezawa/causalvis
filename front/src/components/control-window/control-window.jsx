import React from 'react';

import { Step } from 'semantic-ui-react';

export default class ControlWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(key, icon, e) {
    console.log(key, icon, e);
  }

  renderSteps(steps, key) {
    const renderSteps = steps.map((data) => {
      return (
        <Step icon={data.icon} title={data.title} description={data.description} key={`${key}${data.title}`} onClick={this.handleClick.bind(this, key, data.icon)} />
      );
    });
    return (
      <Step.Group>
        { renderSteps }
      </Step.Group>
    );
  }

  render() {
    const steps = [
      { icon: 'image', title: 'Data', description: 'Analysis movie' },
      { icon: 'filter', title: 'fliter', description: '' },
      { icon: 'crop', title: 'generateTimeSeries', description: 'create time series from movie' },
      { icon: 'line graph', title: 'Cross Correlation' },
      // { disabled: true, icon: 'line graph', title: 'Granger Causality' },
      { icon: 'grid layout', title: 'IRM', description: 'Infinite Relational Model' },
    ];
    const steps2 = [
      { icon: 'image', title: 'Data', description: 'Analysis movie' },
      { icon: 'filter', title: 'fliter', description: '' },
      { icon: 'crop', title: 'generateTimeSeries', description: 'create time series from movie' },
      { icon: 'line graph', title: 'Cross Correlation' },
      { icon: 'grid layout', title: 'IRM', description: 'Infinite Relational Model' },
    ];
    return (
      <div>
        {(() => {
          return this.renderSteps(steps, 'upper');
        })()}
        {(() => {
          return this.renderSteps(steps2, 'below');
        })()}
      </div>
    );
  }
}

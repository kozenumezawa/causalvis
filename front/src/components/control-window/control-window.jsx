import React from 'react';

import { Segment, Step } from 'semantic-ui-react';

export default class ControlWindow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const steps = [
      { icon: 'image', title: 'Data', description: 'Analysis movie' },
      { icon: 'filter', title: 'fliter' },
      { icon: 'crop', title: 'generateTimeSeries', description: 'create time series from movie' },
      { icon: 'line graph', title: 'Granger Causality' },
      // { disabled: true, icon: 'line graph', title: 'Granger Causality' },
      { active: true, icon: 'grid layout', title: 'IRM', description: 'Infinite Relational Model' },
    ];
    const steps2 = [
      { icon: 'image', title: 'Data', description: 'Analysis movie' },
      { icon: 'filter', title: 'fliter' },
      { icon: 'crop', title: 'generateTimeSeries', description: 'create time series from movie' },
      { icon: 'line graph', title: 'Convergent Cross Mapping' },
      { active: true, icon: 'grid layout', title: 'IRM', description: 'Infinite Relational Model' },
    ];
    return (
      <Segment style={{ height: 250 }}>
        <div>
          <br />
          <Step.Group items={steps} />
          <Step.Group items={steps2} />
        </div>
      </Segment>
    );
  }
}

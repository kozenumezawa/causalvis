import React from 'react';

import { Step } from 'semantic-ui-react';

import { openModal } from '../../intents/intent';

import CausalModal from './components/causal-modal.jsx';

export default class ControlWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      position: '',
    };
  }

  handleClick(position, icon) {
    openModal();
    this.setState({
      icon,
      position,
    });
  }

  renderSteps(steps, position) {
    const renderSteps = steps.map((data) => {
      return (

        <Step
          key={`${position}${data.title}`}
          icon={data.icon}
          title={data.title}
          description={data.description}
          onClick={this.handleClick.bind(this, position, data.icon)}
        />
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
        <div>
          {(() => {
            return this.renderSteps(steps, 'upper');
          })()}
        </div>
        <div style={{ marginTop: 10 }}>
          {(() => {
            return this.renderSteps(steps2, 'below');
          })()}
        </div>
        <CausalModal
          openModal={this.props.openModal}
          causalMethodParams={this.props.causalMethodParamsList[0]}
          icon={this.state.icon}
          position={this.state.position}
        />
      </div>
    );
  }
}

import React from 'react';

import { Step } from 'semantic-ui-react';

import ModalContainer from './components/modal-container.jsx';

export default class ControlWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      icon: '',
      position: '',
    };
  }

  handleClick(position, icon, e) {
    this.setState({
      openModal: true,
      icon: icon,
      position: position,
    });
  }

  renderSteps(steps, position) {
    const renderSteps = steps.map((data) => {
      return (
        <Step icon={data.icon} title={data.title} description={data.description} key={`${position}${data.title}`} onClick={this.handleClick.bind(this, position, data.icon)} />
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

        <ModalContainer
          openModal={this.state.openModal}
          icon={this.state.icon}
          position={this.state.position}
        />
      </div>
    );
  }
}

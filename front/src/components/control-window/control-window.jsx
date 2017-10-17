import React from 'react';

import { Step } from 'semantic-ui-react';

import { openModal } from '../../intents/intent';

import CausalModal from './components/causal-modal.jsx';
import DataModal from './components/data-modal.jsx';

const CHANGE_DATA = Symbol('change_data');
const CHANGE_FILTER = Symbol('change_filter');
const CHANGE_GEN = Symbol('change_gen');
const CHANGE_METHOD = Symbol('change_method');
const CHANGE_CLUSTERING = Symbol('change_clustering');

export default class ControlWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      action: '',
      position: '',
    };

    this.renderModal = this.renderModal.bind(this);
  }

  handleClick(position, action) {
    openModal();
    this.setState({
      action,
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
          onClick={this.handleClick.bind(this, position, data.action)}
        />
      );
    });
    return (
      <Step.Group>
        { renderSteps }
      </Step.Group>
    );
  }

  renderModal() {
    switch (this.state.action) {
      case CHANGE_DATA:
        return (
          <DataModal
            openModal={this.props.openModal}
            causalMethodParams={this.props.causalMethodParamsList[0]}
            icon={this.state.icon}
            position={this.state.position}
          />
        );
      case CHANGE_METHOD:
        return (
          <CausalModal
            openModal={this.props.openModal}
            causalMethodParams={this.props.causalMethodParamsList[0]}
            icon={this.state.icon}
            position={this.state.position}
          />
        );
      default:
        return null;
    }
  }

  render() {
    const steps = [
      { icon: 'image', title: 'Data', description: 'Analysis movie', action: CHANGE_DATA },
      { icon: 'filter', title: 'fliter', description: '', action: CHANGE_FILTER },
      { icon: 'crop', title: 'generateTimeSeries', description: 'create time series from movie', action: CHANGE_GEN },
      { icon: 'line graph', title: 'Cross Correlation', action: CHANGE_METHOD },
      // { disabled: true, icon: 'line graph', title: 'Granger Causality' },
      { icon: 'grid layout', title: 'IRM', description: 'Infinite Relational Model', action: CHANGE_CLUSTERING },
    ];
    const steps2 = [
      { icon: 'image', title: 'Data', description: 'Analysis movie', action: CHANGE_DATA },
      { icon: 'filter', title: 'fliter', description: '', action: CHANGE_FILTER },
      { icon: 'crop', title: 'generateTimeSeries', description: 'create time series from movie', action: CHANGE_GEN },
      { icon: 'line graph', title: 'Cross Correlation', action: CHANGE_METHOD },
      { icon: 'grid layout', title: 'IRM', description: 'Infinite Relational Model', action: CHANGE_CLUSTERING },
    ];
    return (
      <div>
        <div>
          {(() => {
            return this.renderSteps(steps, 0);
          })()}
        </div>
        <div style={{ marginTop: 10 }}>
          {(() => {
            return this.renderSteps(steps2, 1);
          })()}
        </div>
        <di>
          {(() => {
            return this.renderModal();
          })()}
        </di>
      </div>
    );
  }
}

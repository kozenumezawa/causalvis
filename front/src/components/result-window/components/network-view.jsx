import React from 'react';

import { selectCluster } from '../../../intents/intent';

export default class NetworkView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.refs.network.addEventListener('nodeclick', this.nodeClick.bind(this));
  }

  shouldComponentUpdate(nextProps) {
    const oldJSON = JSON.stringify(this.props.network);
    const newJSON = JSON.stringify(nextProps.network);
    if (oldJSON === newJSON) {
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    this.refs.network.load(this.props.network);
  }

  nodeClick(e) {
    const clusterNumber = Number(e.detail.id);
    selectCluster(clusterNumber, this.props.positionIdx);
  }

  render() {
    return (
      <eg-renderer-ogdf
        ref="network"
        width="400"
        height="400"
        default-link-target-marker-shape="triangle"
        default-link-target-marker-size="20"
        default-node-fill-color="white"
        default-node-width="50"
        default-node-height="50"
        default-node-label-font-size="30"
        // node-label-property="index"
        node-fill-color-property="color"
        node-width-property="nodeWidth"
        node-height-property="nodeHeight"
        layout-method="sugiyama"
        fmmm-unit-edge-length="200"
        link-stroke-opacity-property="intensity"
      />
    );
  }
}

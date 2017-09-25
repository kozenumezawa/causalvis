import React from 'react';

import { selectCluster } from '../../../intents/intent';
import * as drawingTool from '../../../utils/drawing-tool';

export default class NetworkView extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.refs.network.addEventListener('nodeclick', this.nodeClick.bind(this));
    this.refs.network.load(this.props.network);
  }

  shouldComponentUpdate(nextProps) {
    const oldJSON = JSON.stringify(this.props.network);
    const newJSON = JSON.stringify(nextProps.network);
    if (oldJSON === newJSON) {
      return false;
    }
    return true;
  }

  nodeClick(e) {
    const clusterNumber = Number(e.detail.id);
    selectCluster(clusterNumber, this.props.positionIdx);
  }

  render() {
    return (
      <eg-renderer-ogdf
        ref="network"
        width="250"
        height="250"
        default-link-target-marker-shape="triangle"
        default-link-target-marker-size="20"
        default-node-fill-color="white"
        default-node-width="50"
        default-node-height="50"
        default-node-label-font-size="30"
        default-link-stroke-width="5"
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

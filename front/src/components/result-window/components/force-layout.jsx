import React from 'react';

export default class ForceLayout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.refs.network.addEventListener('nodeClick', this.nodeClick);
  }

  componentDidUpdate() {
    this.refs.network.load(this.props.network);
  }

  nodeClick(e) {
    console.log(e);
  }

  render() {
    return (
      <eg-renderer-ogdf
        ref="network"
        width="400"
        height="400"
        default-link-target-marker-shape="triangle"
        node-label-property="index"
        default-node-fill-color="white"
        layout-method="sugiyama"
        default-node-width="50"
        default-node-height="50"
        default-node-label-font-size="30"
        default-link-target-marker-size="20"
        fmmm-unit-edge-length="200"
        link-stroke-opacity-property="intensity"
      />
    );
  }
}

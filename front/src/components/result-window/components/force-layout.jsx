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
      <eg-renderer ref="network" width="400" height="400" link-source-property="source.index" link-target-property="target.index" default-link-target-marker-shape="triangle" node-label-property="index" default-node-fill-color="red" />
    );
  }
}

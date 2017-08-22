import React from 'react';
import { Switch, Route } from 'react-router-dom'

export default class main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' render={(props) => (
            <div>
              Test
            </div>
          )} />
        </Switch>
      </div>
    );
  }
}
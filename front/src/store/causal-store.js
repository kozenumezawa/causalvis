import Rx from 'rx';

const store = (intentSubject, filterSubject) => {
  const state = {
    causalMatrix: new Array(2),
  };

  const subject = new Rx.BehaviorSubject({ state });

  Rx.Observable.zip(intentSubject, filterSubject).subscribe(([payload, filter]) => {
    if (filter.state.allTimeSeries[0] == null) {
      subject.onNext({ state });
      return;
    }

    window.fetch('http://localhost:3000/api/v1/causal', {
      mode: 'cors',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        allTimeSeries: filter.state.allTimeSeries[0],
        maxLag: 20,
        lagStep: 2,
        method: 'CROSS',
        dataName: 'real',
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        state.causalMatrix[0] = json.causalMatrix;

        window.fetch('http://localhost:3000/api/v1/causal', {
          mode: 'cors',
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            allTimeSeries: filter.state.allTimeSeries[1],
            maxLag: 20,
            lagStep: 2,
            method: 'CROSS',
            dataName: 'sim',
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            state.causalMatrix[1] = json.causalMatrix;
            subject.onNext({ state });
          });
      });
  });
  return subject;
};

export default store;

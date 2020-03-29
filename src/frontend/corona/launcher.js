import 'core-js';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { doc } from '../common/globals';

const stores = {};

const doRender = () =>
  render(
    <Provider {...stores}>
      <div>Hello world</div>
    </Provider>,
    doc.getElementById('app'),
  );

doRender();

window.__stores = stores;

if (module.hot) {
  module.hot.accept();
}

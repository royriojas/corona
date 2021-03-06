import 'core-js';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { doc } from '../common/globals';
import Main from './Components/Main/Main';
import { coronaStore } from '../stores/corona-store';
import '../common/input-method';
import '../less/normalize.less';
import { getScreenSizeStore } from '../common/stores/ScreenSizeStore';

const screenStore = getScreenSizeStore();

const stores = {
  coronaStore,
  screenStore,
};

window.__stores = stores;

const doRender = () =>
  render(
    <Provider {...stores}>
      <Main />
    </Provider>,
    doc.getElementById('app'),
  );

doRender();

if (module.hot) {
  module.hot.accept();
}

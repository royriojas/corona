import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import MultiSelect from '@khanacademy/react-multi-select';
import classnames from 'classnames/bind';
import styles from './Main.less';
import LineWrapper from '../LineWrapper/LineWrapper';
import { LineTooltip } from '../LineTooltip/LineTooltip';

const cx = classnames.bind(styles);

@inject(stores => ({
  countries: stores.coronaStore.countries,
  selectCountries: stores.coronaStore.selectCountries,
  selectedCountries: stores.coronaStore.selectedCountries,
  deathsByCountry: stores.coronaStore.deathsByCountry,
  casesByCountry: stores.coronaStore.casesByCountry,
  recoveredByCountry: stores.coronaStore.recoveredByCountry,
  getCountryById: stores.coronaStore.getCountryById,
  screenStore: stores.screenStore,
}))
@observer
export default class Main extends Component {
  componentDidCatch(error, errorInfo) {
    console.log('>>> error', error, errorInfo);
  }

  getTooltip = (point, last) => {
    const { getCountryById, screenStore } = this.props;
    const { serieId, data } = point;
    const entry = getCountryById(serieId);
    const { x, y, date } = data;

    return <LineTooltip row={screenStore.matchMedium} country={entry.value} date={date} serieColor={point.serieColor} x={x} y={y} last={last} />;
  };

  render() {
    const { props } = this;
    const { countries, selectCountries, selectedCountries, casesByCountry, deathsByCountry, screenStore, recoveredByCountry } = props;

    const link = 'https://github.com/pomber/covid19';
    const githubRepo = 'https://github.com/royriojas/corona/';

    return (
      <div className={cx('Main', { medium: screenStore.matchMedium })}>
        <h1>COVID-19 charts</h1>
        <div className={cx('notes')}>
          <p className={cx('title')}>Description</p>
          <p>
            The following chart compares the progression of the cases since the first case detected per each country. Data points are labeled from day-0 to
            day-n.
          </p>
          <p>Move the mouse over the chart to see the data.</p>
          <img src={'./assets/imgs/hover-state.png'} title="image of the hover state" />
          <p>
            Since some countries have more data than others sometimes is better to use a smaller range of data points to better compare. Use the "Show options"
            to see some useful options for the chart
          </p>
          <p className={cx('title')}>
            The data for these charts come from the{' '}
            <a target="blank" href={link}>
              {link}
            </a>
            {'. '}
          </p>
          <p>
            To see the code of this page go to: <a href={githubRepo}>{githubRepo}</a>.
          </p>
        </div>
        <div className={cx('selector')}>
          <p className={cx('label')}>Countries to compare</p>
          <MultiSelect options={countries} selected={selectedCountries} onSelectedChanged={selectCountries} />
        </div>
        <LineWrapper screenStore={screenStore} title="Cases per country" data={casesByCountry} getTooltipForPoint={this.getTooltip} />
        <LineWrapper screenStore={screenStore} title="Deaths per country" data={deathsByCountry} getTooltipForPoint={this.getTooltip} />
        <LineWrapper screenStore={screenStore} title="Recovered per country" data={recoveredByCountry} getTooltipForPoint={this.getTooltip} />
        <div className={cx('footer')}>
          <p>
            <span>{'Made by '}</span>
            <a target="blank" href="https://twitter.com/royriojas">
              @royriojas
            </a>
          </p>
        </div>
      </div>
    );
  }
}

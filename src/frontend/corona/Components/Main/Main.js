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
  getTooltipForDeathsByPoint: stores.coronaStore.getTooltipForDeathsByPoint,
  getTooltipForCasesByPoint: stores.coronaStore.getTooltipForCasesByPoint,
  screenStore: stores.screenStore,
}))
@observer
export default class Main extends Component {
  componentDidCatch(error, errorInfo) {
    console.log('>>> error', error, errorInfo);
  }

  getTooltipForCases = (point, last) => {
    const { getTooltipForCasesByPoint, screenStore } = this.props;
    const { serieId, data } = point;
    const entry = getTooltipForCasesByPoint({ serieId });
    const { x, y, date } = data;

    return <LineTooltip row={screenStore.matchMedium} country={entry.country} date={date} serieColor={point.serieColor} x={x} y={y} last={last} />;
  };

  getTooltipForDeaths = (point, last) => {
    const { getTooltipForDeathsByPoint, screenStore } = this.props;
    const { serieId, data } = point;
    const entry = getTooltipForDeathsByPoint({ serieId });
    const { x, y, date } = data;

    return <LineTooltip row={screenStore.matchMedium} country={entry.country} date={date} serieColor={point.serieColor} x={x} y={y} last={last} />;
  };

  render() {
    const { props } = this;
    const { countries, selectCountries, selectedCountries, casesByCountry, deathsByCountry, screenStore } = props;

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
          <img src={'/assets/imgs/hover-state.png'} title="image of the hover state" />
          <p>
            Since some countries have more data than others sometimes is better to use a smaller range of data points to better compare. Use the "Show options"
            to see some useful options for the chart
          </p>
        </div>
        <div className={cx('selector')}>
          <p className={cx('label')}>Countries to compare</p>
          <MultiSelect options={countries} selected={selectedCountries} onSelectedChanged={selectCountries} />
        </div>
        <LineWrapper screenStore={screenStore} title="Cases by country" data={casesByCountry} getTooltipForPoint={this.getTooltipForCases} />
        <LineWrapper screenStore={screenStore} title="Deaths by country" data={deathsByCountry} getTooltipForPoint={this.getTooltipForDeaths} />
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

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
}))
@observer
export default class Main extends Component {
  componentDidCatch(error, errorInfo) {
    console.log('>>> error', error, errorInfo);
  }

  getTooltipForCases = (point, last) => {
    const { getTooltipForCasesByPoint } = this.props;
    const { serieId, data } = point;
    const entry = getTooltipForCasesByPoint({ serieId });
    const { x, y, date } = data;

    return <LineTooltip country={entry.country} date={date} serieColor={point.serieColor} x={x} y={y} last={last} />;
  };

  getTooltipForDeaths = (point, last) => {
    const { getTooltipForDeathsByPoint } = this.props;
    const { serieId, data } = point;
    const entry = getTooltipForDeathsByPoint({ serieId });
    const { x, y, date } = data;

    return <LineTooltip country={entry.country} date={date} serieColor={point.serieColor} x={x} y={y} last={last} />;
  };

  render() {
    const { props } = this;
    const { countries, selectCountries, selectedCountries, casesByCountry, deathsByCountry } = props;

    return (
      <div className={cx('Main')}>
        <h1>Coronavirus cases and deaths in the world</h1>
        <MultiSelect options={countries} selected={selectedCountries} onSelectedChanged={selectCountries} />
        <LineWrapper title="Cases by country" data={casesByCountry} getTooltipForPoint={this.getTooltipForCases} />
        <LineWrapper title="Deaths by country" data={deathsByCountry} getTooltipForPoint={this.getTooltipForDeaths} />
      </div>
    );
  }
}

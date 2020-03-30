/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import { ResponsiveLine } from '@nivo/line';
import classNames from 'classnames/bind';
import styles from './LineWrapper.less';
import { Icon } from '../../../common/components/Icon/Icon';

const cx = classNames.bind(styles);

@observer
export default class LineWrapper extends Component {
  @observable
  useArea = false;

  @observable
  useRange = true;

  @observable
  _minIndex;

  @observable
  _maxIndex;

  @observable
  _maxCalculatedIndex;

  @observable
  _showOptions = false;

  @computed
  get minIndex() {
    return Number.parseFloat(this._minIndex) || 0;
  }

  @computed
  get maxIndex() {
    return Number.parseFloat(this._maxIndex) || this._maxCalculatedIndex || this.getMaxIndex(this.props.data);
  }

  sliceTooltip = ({ slice }) => {
    const points = slice?.points;

    const { props } = this;
    const { getTooltipForPoint } = props;

    return (
      <div className={cx('tooltip')}>
        {points.map((point, index) => (
          <div key={`${point.serieId}_${point.index}`}>{getTooltipForPoint(point, index === points.length - 1)}</div>
        ))}
      </div>
    );
  };

  @action
  updateMinIndex = e => {
    const str = e.target.value;
    this._minIndex = str;
  };

  @action
  toggleOptions = () => {
    this._showOptions = !this._showOptions;
  };

  @action
  updateMaxIndex = e => {
    const str = e.target.value;

    this._maxIndex = str;
  };

  @action
  toggleArea = e => {
    this.useArea = e.target.checked;
  };

  @action
  toggleUseRange = e => {
    this.useRange = e.target.checked;
  };

  getMaxIndex = data =>
    (data || []).reduce((acc, entry) => {
      if (entry.data.length > acc) {
        acc = entry.data.length;
      }
      return acc;
    }, 0);

  @action
  updateMaxCalculated = data => {
    const maxIndex = this.getMaxIndex(data);

    this._maxCalculatedIndex = maxIndex;
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.updateMaxCalculated(this.props.data);
    }
  }

  componentDidMount() {
    this.updateMaxCalculated(this.props.data);
  }

  filterData = data => {
    if (!this.useRange) return data;
    return data.map(entry => ({ ...entry, data: entry.data.slice(this.minIndex, this.maxIndex) }));
  };

  render() {
    const { props } = this;
    const { title, axisLeft, margin, xScale, data, getTooltipForPoint, yScale, screenStore } = props;

    const calculatedAxisLeft = {
      orient: 'left',
      tickSize: screenStore.matchMedium ? 5 : -5,
      tickPadding: screenStore.matchMedium ? 5 : -25,
      tickRotation: 0,
      ...axisLeft,
    };

    return (
      <div className={cx('LineWrapper', { medium: screenStore.matchMedium })}>
        <h2>{title}</h2>
        <button type="button" className={cx('button')} onClick={this.toggleOptions}>
          <Icon name="cog" lighterForeground />
          <span className={cx('buttonLabel')}>{!this._showOptions ? 'Show Options' : 'Hide Options'}</span>
        </button>
        {this._showOptions && (
          <div className={cx('Controls')}>
            <label className={cx('Field')}>
              <span className={cx('label')}>Area</span>
              <span>
                <input type="checkbox" checked={this.showAreaUnderLine} onChange={this.toggleArea} />
                <span className={cx('text')}>Show area under line</span>
              </span>
            </label>
            <label className={cx('Field')}>
              <span className={cx('label')}>Range</span>
              <span>
                <input type="checkbox" checked={this.useRange} onChange={this.toggleUseRange} />
                <span className={cx('text')}>Use the following range</span>
              </span>
            </label>
            <label className={cx('Field', 'last')}>
              <span className={cx('label')}>Range (min/max Indexes)</span>
              <span className={cx('range')}>
                <input min={0} max={this.maxIndex} type="number" value={this.minIndex} onChange={this.updateMinIndex} />
                <input min={this.minIndex} max={this._maxCalculatedIndex} type="number" value={this.maxIndex} onChange={this.updateMaxIndex} />
              </span>
            </label>
          </div>
        )}
        <div className={cx('Line')}>
          <ResponsiveLine
            animate={false}
            data={this.filterData(data)}
            margin={{
              top: 10,
              right: 10,
              bottom: 45,
              left: screenStore.matchMedium ? 60 : 20,
              ...margin,
            }}
            xScale={{ type: 'point', ...xScale }}
            yScale={{ type: 'linear', ...yScale }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={calculatedAxisLeft}
            colors={{ scheme: 'nivo' }}
            pointSize={5}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="y"
            enableGridX={screenStore.matchMedium}
            pointLabelYOffset={-12}
            useMesh={true}
            enableArea={this.useArea}
            enableSlices="x"
            sliceTooltip={getTooltipForPoint ? this.sliceTooltip : undefined}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 35,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';

import { ResponsiveLine } from '@nivo/line';
import classNames from 'classnames/bind';
import styles from './LineWrapper.less';

const cx = classNames.bind(styles);

@observer
export default class LineWrapper extends Component {
  @observable
  useArea = false;

  @observable
  useRange = false;

  @observable
  _minIndex;

  @observable
  _maxIndex;

  @observable
  _maxCalculatedIndex;

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
    const { title, axisLeft, margin, xScale, data, getTooltipForPoint, yScale } = props;

    const calculatedAxisLeft = {
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legendOffset: -40,
      legendPosition: 'middle',
      ...axisLeft,
    };

    return (
      <div className={cx('LineWrapper')}>
        <h2>{title}</h2>
        <div className={cx('Controls')}>
          <label>
            <span>Area</span>
            <span>
              <input type="checkbox" checked={this.showAreaUnderLine} onChange={this.toggleArea} />
              <span>Show area under line</span>
            </span>
          </label>
          <label>
            <span>Range</span>
            <span>
              <input type="checkbox" checked={this.useRange} onChange={this.toggleUseRange} />
              <span>Use range</span>
            </span>
          </label>
          <label>
            <span>Range (min/max Indexes)</span>
            <span>
              <input min={0} max={this.maxIndex} type="number" value={this.minIndex} onChange={this.updateMinIndex} />
              <input min={this.minIndex} max={this._maxCalculatedIndex} type="number" value={this.maxIndex} onChange={this.updateMaxIndex} />
            </span>
          </label>
        </div>
        <div className={cx('Line')}>
          <ResponsiveLine
            animate={false}
            data={this.filterData(data)}
            margin={{ top: 10, right: 110, bottom: 50, left: 60, ...margin }}
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
            pointLabelYOffset={-12}
            useMesh={true}
            enableArea={this.useArea}
            enableSlices="x"
            sliceTooltip={getTooltipForPoint ? this.sliceTooltip : undefined}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
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

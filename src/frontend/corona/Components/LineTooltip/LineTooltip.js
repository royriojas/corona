import React from 'react';
import classNames from 'classnames/bind';
import styles from './LineTooltip.less';
import { formatAsNumber, formatAsDate } from '../../../common/format';

const cx = classNames.bind(styles);

export const LineTooltip = ({ country, row, date, serieColor, x, y, last }) => (
  <div className={cx('countryBlock', { last, row })}>
    <div className={cx('block-1')}>
      <div className={cx('box')} style={{ background: serieColor }} />
    </div>
    <div className={cx('block-2')}>
      <p className={cx('countryInfo')}>{`${country}`}</p>
      <p className={cx('pointInfo')}>{`${x} (${formatAsDate(date)})`}</p>
    </div>
    <div className={cx('block-3')}>
      <p className={cx('count')}>{`${formatAsNumber(y)}`}</p>
    </div>
  </div>
);

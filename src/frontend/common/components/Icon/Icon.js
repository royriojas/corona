import React from 'react';
import classNames from 'classnames/bind';
import styles from './Icon.less';

const cx = classNames.bind(styles);

export const Icon = ({ name, size = 16, type = 'fa', disabled, noColor, highlight, lighterForeground, className, style, colorIcon, noFontSize }) => {
  let icon;

  const theStyle = {
    ...style,
  };

  if (colorIcon) {
    theStyle.fill = colorIcon;
  }

  if (type === 'fa') {
    const factor = 0.875;
    const fontSize = !noFontSize ? size * factor : undefined;
    const color = !noColor ? colorIcon : undefined;
    icon = <i data-c="icon-ele" className={`fa fa-${name}`} style={{ fontSize, color }} />;
  }

  return (
    <span data-c="icon" className={cx('icon', { lighterForeground, disabled, highlight, withColor: !noColor }, className)} style={style}>
      {icon}
    </span>
  );
};

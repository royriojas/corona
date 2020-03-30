import { window } from './globals';
import typeOf from '../../backend/common/type-of';

export const sizes = {
  xsmall1: 'xsmall1',
  xsmall2: 'xsmall2',
  small1: 'small1',
  small2: 'small2',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
};

const sizeOrders = {
  xsmall1: 0,
  xsmall2: 1,
  small1: 2,
  small2: 3,
  medium: 4,
  large: 5,
  xlarge: 6,
};

const mediaQueries = [
  {
    max: 480,
    id: sizes.xsmall1,
  },
  {
    min: 481,
    max: 600,
    id: sizes.xsmall2,
  },
  {
    min: 601,
    max: 840,
    id: sizes.small1,
  },
  {
    min: 841,
    max: 960,
    id: sizes.small2,
  },
  {
    min: 961,
    max: 1264,
    id: sizes.medium,
  },
  {
    min: 1265,
    max: 1904,
    id: sizes.large,
  },
  {
    min: 1905,
    id: sizes.xlarge,
  },
];

/**
 * helper function to render a media query given a structure with min, max and id.
 *
 * @param      {Object} descriptor  a structure with the following fields
 *   @param [descriptor.min] {Number} the min value for the media query. If present it will add
 *                                    a media query like `(min-width: descriptor.min)`
 *   @param [descriptor.max] {Number} the max value for the media query. If present it will add
 *                                    a media query like `(max-width: descriptor.max)`
 *   @param descriptor.id  {String} the id to be used as the value of the `data-screen-size`
 *                                    attribute to be set in the html element
 * @return     {string} the string representing a media query to be used by matchMedia
 */
const renderMQ = ({ min, max }) => {
  let mq = '';
  const isMinANumber = typeOf(min) === 'number';
  const isMaxANumber = typeOf(max) === 'number';
  if (isMinANumber) {
    mq += `(min-width: ${min}px)`;
  }

  if (isMinANumber && isMaxANumber) {
    mq += ' and ';
  }

  if (isMaxANumber) {
    mq += `(max-width: ${max}px)`;
  }

  return mq;
};

let currentSize;

/**
 * This function creates mediaquery listeners, when a given query matches it
 * adds the `data-screen-size` attribute to the topmost DOM element (html).
 *
 * The possible values are:
 * - xsmall1
 * - xsmall2
 * - small1
 * - small2
 * - medium
 * - large
 * - xlarge
 *
 * @param      {Array}  breakpoints  The breakpoint media queries specifying
 *                                   min, max and the id to use if the query matches
 * @param      {Function} onChange   fires when the given media query matches
 */
const createBreakpoints = (breakpoints = [], onChange) => {
  breakpoints.forEach(({ min, id, max }) => {
    const mq = window.matchMedia(renderMQ({ min, max }));

    const handleChange = query => {
      if (query.matches) {
        currentSize = id;
        onChange && onChange(id);
      }
    };

    mq.addListener(handleChange);
    handleChange(mq);
  });
};

export const initLayoutHelper = onChange => {
  createBreakpoints(mediaQueries, onChange);
};

export const getScreenSize = () => currentSize;

export const screenIsAtLeast = (sizeIdToCompare, sizeId) => sizeOrders[sizeIdToCompare] >= sizeOrders[sizeId];
export const screenIsAtMost = (sizeIdToCompare, sizeId) => sizeOrders[sizeIdToCompare] <= sizeOrders[sizeId];

export const screenIsShorterThan = (sizeIdToCompare, sizeId) => sizeOrders[sizeIdToCompare] < sizeOrders[sizeId];
export const screenIsGreaterThan = (sizeIdToCompare, sizeId) => sizeOrders[sizeIdToCompare] > sizeOrders[sizeId];

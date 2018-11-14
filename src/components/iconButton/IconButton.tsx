import React from 'react';
import cx from 'classnames';
import { css } from 'emotion';

interface Props {
  iconName: string;
  color?: string;
  onClick?: (event?: React.MouseEvent<SVGGElement>) => void;
  height?: number;
  width?: number;
  className?: string;
  children?: React.ReactChildren | React.ReactElement<any>;
}

/**
 * Returns the `d` attribute for the icon button's `<path>` element based on
 *    the specified icon name.
 * @param iconName Name of the icon to get path for.
 */
const getIconPath = (iconName: string) =>
  ({
    arrowUp: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z',
    arrowDown: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z',
    edit:
      'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04' +
      'c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0' +
      'l-1.83 1.83 3.75 3.75 1.83-1.83z',
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    refresh:
      'M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8' +
      'c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2' +
      'c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3' +
      'c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z',
    save:
      'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4z' +
      'm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z' +
      'm3-10H5V5h10v4z',
    skipPrevious: 'M12 12h4v24h-4zm7 12l17 12V12z',
    skipNext: 'M12 36l17-12-17-12v24zm20-24v24h4V12h-4z',
  }[iconName]);

/**
 * SVG button with icon based on the specified icon name.
 * @param iconName Name of the icon to display.
 * @param [color="var(--dark-gray)] Fill color of the icon.
 * @param [className=''] Optional CSS class to apply to SVG element.
 * @param [children] React child elements to render within SVG element.
 * @param ...rest Additional props to apply to SVG element.
 * @functional
 */
const IconButton: React.SFC<Props> = ({
  iconName,
  color = 'var(--dark-gray)',
  className = '',
  children,
  ...rest
}) => (
  <svg
    className={cx(
      className,
      css`
        cursor: pointer;
        fill: ${color};

        &:hover {
          opacity: 0.5;
        }
      `,
    )}
    focusable="false"
    viewBox="0 0 24 24"
    {...rest}
  >
    {children}
    <path d={getIconPath(iconName)} className="iconButton" />
  </svg>
);

IconButton.defaultProps = {
  height: 36,
  width: 36,
};

export default IconButton;

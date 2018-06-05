import React from 'react';
import classnames from 'classnames';
import { css } from 'emotion';
import iconPaths from './iconPaths';

interface Props {
  iconName: string;
  color?: string;
  onClick?: () => void;
  height?: number;
  width?: number;
  className?: string;
  children?: any;
}

const IconButton: React.SFC<Props> = ({
  iconName,
  color = 'var(--dark-gray)',
  className = '',
  children,
  ...rest
}) => {
  const svgStyle = css`
    cursor: pointer;
    fill: ${color};

    &:hover {
      opacity: 0.5;
    }
  `;

  return (
    <svg
      className={classnames(svgStyle, className)}
      focusable="false"
      viewBox="0 0 24 24"
      {...rest}
    >
      {children}
      <path d={iconPaths[iconName]} className="iconButton" />
    </svg>
  );
};

IconButton.defaultProps = {
  height: 36,
  width: 36,
};

export default IconButton;

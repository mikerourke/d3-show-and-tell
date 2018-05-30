import React from 'react';
import styled from 'styled-components';
import iconPaths from './iconPaths';

interface Props {
  iconName: string;
  onClick: () => void;
  height?: number;
  width?: number;
  className?: string;
}

const IconButton: React.SFC<Props> = ({ iconName, onClick, ...rest }) => {
  const StyledSvg = styled.svg`
    cursor: pointer;
    fill: #374047;
    margin: 0 4px;

    &:hover {
      opacity: 0.5;
    }
  `;

  return (
    <StyledSvg
      focusable="false"
      viewBox="0 0 24 24"
      onClick={onClick}
      {...rest}
    >
      <path d={iconPaths[iconName]} className="iconButton" />
    </StyledSvg>
  );
};

IconButton.defaultProps = {
  height: 36,
  width: 36,
};

export default IconButton;

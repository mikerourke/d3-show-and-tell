import React from 'react';
import styled from 'styled-components';
import { ButtonTransparent } from 'rebass';

interface Props {
  direction: string;
  onClick?: any;
}

const ArrowButton: React.SFC<Props> = ({ direction, onClick }) => {
  const StyledButton = styled(ButtonTransparent)`
    padding: 0;
    margin-left: 4px;
    cursor: pointer;
    height: 32px;
    width: 32px;
  `;

  const arrowPath = {
    down: 'M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z',
    up: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  }[direction];

  return (
    <StyledButton onClick={onClick}>
      <svg x={0} y={0} width={32} height={32} viewBox="0 0 24 24">
        <path d={arrowPath} fill="white" />
        <path fill="none" d="M0,0 h24 v24 H0 V0 z" />
      </svg>
    </StyledButton>
  );
};

export default ArrowButton;

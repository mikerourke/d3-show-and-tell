import React from 'react';
import styled from 'styled-components';
import { Select, Toolbar } from 'rebass';
import { CHART_NAMES } from '../../../constants';

const Header: React.SFC<{}> = () => {
  const StyledSelect = styled(Select)`
    max-width: 80px;
  `;
  return (
    <Toolbar>
      <h2>D3!</h2>
      <StyledSelect ml="auto">
        {CHART_NAMES.map(chartName => (
          <option key={chartName}>{chartName}</option>
        ))}
      </StyledSelect>
    </Toolbar>
  );
};

export default Header;

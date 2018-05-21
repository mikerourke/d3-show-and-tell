import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { TabItem } from 'rebass';

interface Props {
  isActive: boolean;
  chartName: string;
  onTabClick: (event: any) => void;
}

const ChartTab: React.SFC<Props> = ({
  isActive,
  chartName,
  onTabClick,
}) => {
  const StyledTab = styled(TabItem)`
    cursor: pointer;
    text-align: center;
    width: 100px;
  `;

  return (
    <StyledTab mr={8} onClick={onTabClick} className={classnames({ isActive })}>
      {chartName}
    </StyledTab>
  );
};

export default ChartTab;

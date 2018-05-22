import React from 'react';
import { BoxDimensions } from '../../types/commonTypes';

interface Margins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface Props {
  margins: Margins;
  view: BoxDimensions;
  children: any;
}

const ScalingSurface: React.SFC<Props> = ({ margins, view, children }) => {
  const { left, right, bottom, top } = margins;
  const { height, width } = view;

  const totalHeight = height + bottom + top;
  const totalWidth = width + left + right;

  return (
    <svg
      width={totalWidth}
      height="100%"
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      preserveAspectRatio="xMidYMid"
    >
      <g transform={`translate(${left}, ${top})`}>{children}</g>
    </svg>
  );
};

export default ScalingSurface;

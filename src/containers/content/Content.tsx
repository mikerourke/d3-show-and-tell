import React from 'react';
import { css } from 'emotion';
import ContentsColumn from './contentsColumn/ContentsColumn';
import EditorColumn from './editorColumn/EditorColumn';

interface Props {
  match: {
    params: {
      slideNumber: string;
    };
  };
}

const columnStyle = css`
  float: left;
  width: 48%;
  margin: 0 1%;
  position: relative;
`;

/**
 * Wrapper component for the Editor and Contents columns.
 * @param match Router match property that slide number is extrapolated from.
 * @functional
 */
const ContentComponent: React.SFC<Props> = ({
  match: {
    params: { slideNumber },
  },
}) => (
  <div
    className={css`
      margin: 8px;
      height: calc(100% - 84px);

      &:after {
        content: '';
        display: table;
        clear: both;
      }
    `}
  >
    <EditorColumn slideNumber={+slideNumber} className={columnStyle} />
    <ContentsColumn slideNumber={+slideNumber} className={columnStyle} />
  </div>
);

export default ContentComponent;

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

export default class ContentComponent extends React.Component<Props> {
  render() {
    const slideNumber = +this.props.match.params.slideNumber;
    const columnStyle = css`
      float: left;
      width: 48%;
      margin: 0 1%;
      position: relative;
    `;

    return (
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
        <EditorColumn slideNumber={slideNumber} className={columnStyle} />
        <ContentsColumn slideNumber={slideNumber} className={columnStyle} />
      </div>
    );
  }
}

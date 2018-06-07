import React from 'react';
import { goToBookmarkOrComponent } from '@utils/editorUtils';
import { CodeEditor, Direction } from '@customTypes/commonTypes';
import IconButton from '@components/iconButton/IconButton';

interface Props {
  goTo: Direction;
  editor: CodeEditor;
}

const GoToBookmarkButton: React.SFC<Props> = ({ goTo, editor }) => (
  <g
    data-tip={`Click to navigate to the ${goTo} bookmark`}
    data-for="bookmarkNavTooltip"
    transform={`translate(0, ${goTo === 'next' ? 48 : 0})`}
  >
    <IconButton
      iconName={`arrow${goTo === 'previous' ? 'Up' : 'Down'}`}
      color="#0E7E12"
      onClick={() => goToBookmarkOrComponent(editor, goTo, true)}
    >
      <circle cx={12} cy={12} r={10} fill="white" />
    </IconButton>
  </g>
);

export default GoToBookmarkButton;

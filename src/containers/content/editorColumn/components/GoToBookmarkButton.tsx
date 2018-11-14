import React from 'react';
import { goToBookmarkOrComponent } from '@utils/editorUtils';
import IconButton from '@components/iconButton/IconButton';
import { CodeEditor, Direction } from '@customTypes/common';

interface Props {
  goTo: Direction;
  editor: CodeEditor;
}

/**
 * Navigation button used to go to the previous or next bookmark when clicked.
 * @param goTo Direction to move (previous or next bookmark).
 * @param editor Monaco editor instance.
 * @functional
 */
const GoToBookmarkButton: React.SFC<Props> = ({ goTo, editor }) => (
  <g
    data-tip={`Click to navigate to the ${goTo} bookmark`}
    data-for="bookmarkNavTooltip"
    transform={`translate(0, ${goTo === Direction.Next ? 48 : 0})`}
  >
    <IconButton
      iconName={`arrow${goTo === Direction.Previous ? 'Up' : 'Down'}`}
      color="#0E7E12"
      onClick={() => goToBookmarkOrComponent(editor, goTo, true)}
    >
      <circle cx={12} cy={12} r={10} fill="white" />
    </IconButton>
  </g>
);

export default GoToBookmarkButton;

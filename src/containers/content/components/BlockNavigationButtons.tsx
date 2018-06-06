import React from 'react';
import capitalize from 'lodash/capitalize';
import { css } from 'emotion';
import { goToCommentOrComponent } from '@utils/editorUtils';
import IconButton from '@components/iconButton/IconButton';

interface Props {
  editor: any;
}

const BlockNavigationButtons: React.SFC<Props> = ({ editor }) => {
  const handleIconButtonClick = (direction: 'up' | 'down') => (event: any) => {
    goToCommentOrComponent(editor, direction, event.metaKey);
  };

  const renderButton = (direction: 'up' | 'down') => (
    <IconButton
      iconName={`arrow${capitalize(direction)}`}
      color="var(--pandera-blue)"
      onClick={handleIconButtonClick(direction)}
    >
      <circle cx={12} cy={12} r={10} fill="white" />
    </IconButton>
  );

  return (
    <svg
      width={36}
      className={css`
        position: absolute;
        right: 32px;
        bottom: 32px;
        height: 104px;
      `}
    >
      <g transform="translate(0 0)">{renderButton('up')}</g>
      <g transform="translate(0 48)">{renderButton('down')}</g>
    </svg>
  );
};

export default BlockNavigationButtons;

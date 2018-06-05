import React from 'react';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import { css } from 'emotion';
import IconButton from '@components/iconButton/IconButton';

interface Props {
  editor: any;
}

const BlockNavigationButtons: React.SFC<Props> = ({ editor }) => {
  const goToLineNumber = ({
    startIncrement,
    findFnName,
  }: {
    startIncrement: number;
    findFnName: string;
  }) => {
    const { lineNumber } = editor.getPosition();

    const goToMatch = editor
      .getModel()
      [findFnName](
        /\/\/|\/\*/,
        { column: 1, lineNumber: lineNumber + startIncrement },
        true,
        false,
        null,
        false,
      );
    const targetLineNumber = get(goToMatch, ['range', 'startLineNumber'], null);
    if (targetLineNumber) {
      editor.revealLineInCenter(targetLineNumber);
      editor.setPosition({ lineNumber: targetLineNumber, column: 1 });
      editor.focus();
    }
  };

  const handleIconButtonClick = (direction: string) => () => {
    const optionsByDirection = {
      up: {
        findFnName: 'findPreviousMatch',
        startIncrement: -1,
      },
      down: {
        findFnName: 'findNextMatch',
        startIncrement: 1,
      },
    }[direction];
    goToLineNumber(optionsByDirection);
  };

  const renderButton = (direction: 'up' | 'down') => (
    <IconButton
      iconName={`arrow${capitalize(direction)}`}
      color="var(--pandera-blue)"
      onClick={handleIconButtonClick(direction)}
    >
      <circle
        cx={12}
        cy={12}
        r={10}
        className={css`
          stroke-width: 2px;
          stroke: var(--pandera-blue);
        `}
        fill="white"
      />
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

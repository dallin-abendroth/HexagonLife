import React, { useState } from 'react';
import Hexagon from './Hexagon';
import { ClearButton } from './ClearButton.styled';
import styled from '@emotion/styled';
import { ButtonContainer } from './ButtonContainer.styled';
import { PlayButton } from './PlayButton.styled';
import { RewindButton } from './RewindButton.styled';
import { PauseButton } from './PauseButton.styled';
import { calculateNextGridState } from './utils';

type HexGridProps = {
  rows: number,
  cols: number,
  hexSize: number,
};

const HexRow = styled.div<{ isEven: boolean, hexSize: number }>`
  display: flex;
  margin-left: ${props => props.isEven ? "0px" : `${props.hexSize / 2}px`};
`;

const HexGrid: React.FC<HexGridProps> = ({ rows, cols, hexSize }) => {
  const [grid, setGrid] = useState(() => {
    return Array(rows).fill(null).map(() => Array(cols).fill(false));
  });
  const [savedGrid, setSavedGrid] = useState<Array<Array<boolean>>>(Array(rows).fill(Array(cols).fill(false)));

  const isGridEmpty = !grid.flat().includes(true);
  const isSavedGridEmpty = !savedGrid.flat().includes(true);

  const clearGrid = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill(false)));
  };

  const moveForward = () => {
    const nextGridState = calculateNextGridState(grid);
    setGrid(nextGridState);
  };

  const rewind = () => {
    setGrid(savedGrid);
  }

  const toggleHexagon = (row: number, col: number) => {
    const newGrid = grid.map(innerArray => [...innerArray]);
    newGrid[row][col] = !newGrid[row][col];
    setGrid(newGrid);

    // If after toggling, the grid is not empty, save the state
    if (newGrid.flat().includes(true)) {
      setSavedGrid(newGrid);
    }
  };

  return (
    <div>
      <ButtonContainer>
        <ClearButton onClick={clearGrid} disabled={isGridEmpty} />
        <PlayButton onClick={moveForward} disabled={isGridEmpty} />
        <PauseButton disabled />
        <RewindButton onClick={rewind} disabled={isSavedGridEmpty} />
      </ButtonContainer>
      {grid.map((row, i) => (
        <HexRow key={i} isEven={i % 2 === 0} hexSize={hexSize}>
          {row.map((toggled, j) => (
            <Hexagon key={j} toggled={toggled} hexSize={hexSize} onClick={() => toggleHexagon(i, j)} />
          ))}
        </HexRow>
      ))}
    </div>
  );
};

export default HexGrid;
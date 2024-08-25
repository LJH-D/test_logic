import React, { useState } from 'react';
import ChoiceTest from './components/choiceTest';
import axios from 'axios';
import Test from './components/Test';
import Result from './components/Result';

function App() {
  const [pageState, setPageState] = useState<'choiceTest' | 'test' | 'find' | 'result'>(
    'choiceTest',
  );

  const roundLength = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const rounding = Number(window.localStorage.getItem('round')) || 1;
  return (
    <div
      style={{
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 'green',
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* 여기 안에서 컨텐츠만 바뀌는것 */}
      <div
        style={{
          flexDirection: 'column',
          display: 'flex',
          width: 360,
          backgroundColor: 'lightblue',
        }}
      >
        {/* 테스트 선택 */}
        {pageState === 'choiceTest' && (
          <ChoiceTest roundLength={roundLength} rounding={rounding} setPageState={setPageState} />
        )}

        {/* 테스트 */}
        {pageState === 'test' && <Test setPageState={setPageState} />}
        {pageState === 'result' && <Result />}
        <div onClick={() => setPageState('choiceTest')}>메인으로</div>
        <br />
        <br />
        <br />
      </div>
    </div>
  );
}

export default App;

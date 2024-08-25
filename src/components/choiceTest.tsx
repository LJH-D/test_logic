import { Dispatch, SetStateAction } from 'react';

function ChoiceTest({
  roundLength,
  rounding,
  setPageState,
}: {
  roundLength: number[];
  rounding: number;
  setPageState: Dispatch<SetStateAction<any>>;
}) {
  return (
    <div>
      <p>단어장 테스트 하기</p>
      {roundLength.map((item, index) => (
        <div
          key={item}
          onClick={() => {
            if (item > rounding) {
              window.alert('아직 풀 수 없습니다');
              return;
            }
            window.alert(`${rounding}회차 테스트`);
            setPageState('test');
          }}
          style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}
        >
          <div style={{ margin: 5, display: 'flex' }} key={item + index.toString()}>
            {item}회차 테스트 ||||
          </div>
          <div>{rounding < item ? '아직 열리지않음' : rounding === item ? '열림' : '응시완료'}</div>
        </div>
      ))}
    </div>
  );
}

export default ChoiceTest;

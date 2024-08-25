import axios from 'axios';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { TestResponse, WordProps, WordUpdateProps } from '../types';

function Test({ setPageState }: { setPageState: Dispatch<SetStateAction<any>> }) {
  const [testList, setTestList] = useState<TestResponse>({} as TestResponse);
  const [ready, setReady] = useState(false);
  const [nowExam, setNowExam] = useState<WordUpdateProps>({} as WordUpdateProps);
  const [meanings, setMeanings] = useState([] as string[]);
  const remainingCnt = useRef(0);
  const maxCntRef = useRef(0);
  const fCntRef = useRef(0);
  const sCntRef = useRef(0);
  const [currentWord, setCurrentWord] = useState('');
  const [processing, setProcessing] = useState(1);

  const getRandomElements = (array: WordUpdateProps[]): [WordUpdateProps, WordUpdateProps[]] => {
    const index = Math.floor(Math.random() * array.length);
    const currentList = [...array];
    const newExam = currentList.splice(index, 1)[0];
    if (newExam.word === currentWord) {
      return getRandomElements(array);
    }
    setCurrentWord(newExam.word);
    return [newExam, array];
  };

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const makeMeaningList = (value: string, array: WordUpdateProps[]) => {
    if (array.length === 0) return [];
    let cnt = 0;
    console.log('첫미닝', value);
    const result: string[] = [value];
    while (cnt < 3) {
      const random = Math.floor(Math.random() * array!.length);
      const findValue = array[random].meaning;

      if (findValue === value) {
        console.log('겹친다 다시돌려.');
        continue;
      }
      if (!result.includes(findValue)) {
        result.push(findValue);
        cnt++;
      }
    }
    const realResult = shuffleArray(result);
    return realResult;
  };

  // 정답여부를 판단하고 만약 이친구가 기존에
  const handleAnswer = (isPass: boolean, choiceMean: string) => {
    const currentState = testList.words.filter((item) => item.id === nowExam.id)[0];
    const firstCnt = currentState.count === 0 ? true : false;
    const rankChange = isPass ? 0.1 : -0.1;
    const initialRank = isPass ? 1 : -1;

    const newItem: WordUpdateProps = {
      ...currentState,
      count: currentState.count + 1,
      answerList: meanings,
      choiceMean,
    };

    if (!firstCnt) {
      newItem.rank = newItem.rank + rankChange;
    } else {
      newItem.rank = newItem.rank + initialRank;
      newItem.isPass = isPass;
    }

    const recycleList = testList.words.map((item) => {
      if (item.id === newItem.id) {
        item = { ...newItem };
      }
      return item;
    });
    setTestList((prev) => ({ ...prev, words: [...recycleList] }));
    setProcessing((prev) => prev + 1);

    // 이 위까지가 문제 맞춘것에 대한 로직
    // 아래부터는 다음 문제는 뭘 출제할지에 대한 것

    const alreadyNull = recycleList.filter((item) => item.count === 0);
    // 널인놈들이 있다면 일단 여기서 한문제 출제
    console.log(recycleList);
    if (alreadyNull.length > 0) {
      const randomEle = getRandomElements(alreadyNull)[0];
      setNowExam(randomEle);
      setMeanings(makeMeaningList(randomEle.meaning, recycleList));
      return;
    }

    // 다했으면 이제 넘어가

    // const sortedArray = recycleList.sort((a, b) => {
    //   // count가 4 이상인지 먼저 확인
    //   const aHighCount = a.count >= 3;
    //   const bHighCount = b.count >= 3;

    //   if (aHighCount !== bHighCount) {
    //     // count가 4 이상인 항목을 후순위로
    //     return aHighCount ? 1 : -1;
    //   }

    //   // count가 4 이상 또는 미만으로 동일한 경우, rank로 비교
    //   if (a.rank !== b.rank) {
    //     return a.rank - b.rank; // rank가 낮은 순서대로
    //   }

    //   // rank가 같으면 count로 비교
    //   return a.count - b.count; // count가 낮은 순서대로
    // });
    // // 만약 널이끝났다면 isPass가 false인놈들 중에서 출제하되, sort처리해서 rank가 낮고 count가 낮은애를
    const fList = recycleList.filter((item) => item.isPass === false);
    const sList = recycleList.filter((item) => item.isPass);

    // 부족하면 리메인을 올려서 ㄱㄱ
    if (fList.length * 0.26 > fList.length) {
      remainingCnt.current = maxCntRef.current / 2 - fList.length;
    }

    console.log(remainingCnt, fList.length);
    // f가 부족할 경우 맞춘 문제에서 먼저 나오게 해야함
    if (sList.length > 0 && remainingCnt.current > 0) {
      sCntRef.current++;
      --remainingCnt.current;
      const [exam] = getRandomElements(sList);
      setNowExam(exam);
      setMeanings(makeMeaningList(exam.meaning, recycleList));
      return;
    }

    if (fCntRef.current <= maxCntRef.current / 2 && fList.length > 0) {
      fCntRef.current++;
      const [exam] = getRandomElements(fList);
      setNowExam(exam);
      setMeanings(makeMeaningList(exam.meaning, recycleList));
      return;
    }

    if (fCntRef.current + sCntRef.current >= maxCntRef.current / 2) {
      const newList: WordUpdateProps[] = [];
      const f = fList
        .map((item) => {
          newList.push(item);
          const zz = { word: item.word, 반복: item.count, 랭크: item.rank };
          return zz;
        })
        .sort((a, b) => a.반복 - b.반복);
      const s = sList
        .map((item) => {
          newList.push(item);
          const zz = { word: item.word, 반복: item.count, 랭크: item.rank };
          return zz;
        })
        .sort((a, b) => a.반복 - b.반복);

      console.log(f);
      console.log(s);
      // 서버에 patch도 보내야함
      // axios.patch('http://localhost:8000/api/v1/vocabulary/2/exam', {
      //   round: testList.round,
      //   words: newList,
      // });
      window.localStorage.setItem('round', `${testList.round + 1}`);
      setPageState('result');
      let fEver = 0;
      let fCnt = 0;
      let sEver = 0;
      let sCnt = 0;
      let fLeng = 0;
      let sLeng = 0;
      const everF = testList.words.filter((item) => {
        if (item.isPass === false) {
          fEver = fEver + item.rank;
          fLeng++;
          fCnt = fCnt + item.count;
        } else if (item.isPass) {
          sEver = sEver + item.rank;
          sCnt = sCnt + item.count;
          sLeng++;
        }
      });
      const data = {
        fList: f,
        sList: s,
        fEver: fCnt / fLeng,
        fRankEver: fEver / fLeng,
        sEver: sCnt / sLeng,
        sRankEver: sEver / sLeng,
      };
      window.localStorage.setItem('result', JSON.stringify(data));
      console.log(`틀린 문제 평균 반복수 : ${fCnt / fLeng}`);
      console.log(`틀린 문제 평균 랭크 : ${fEver / fLeng}`);
      console.log(`맞은 문제 평균 반복수 : ${sCnt / sLeng}`);
      console.log(`맞은 문제 평균 랭크 : ${sEver / sLeng}`);
      return;
    }
  };

  // 처음 받아온 list의 length x2 가 채워야할 개수고
  // 그중에서 f의 비율은
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const reqTest = async () => {
    const [tesReq] = await Promise.all([
      axios.get('http://192.168.25.50:8000/api/v1/vocabulary/2/exam'),
    ]);
    console.log(tesReq.data.words);
    const newTestList = tesReq.data.words;
    const [newExam, updateList] = getRandomElements(newTestList);
    maxCntRef.current = updateList.length * 2;
    // sCntRef.current = updateList.length * 2 * 0.2;
    // fCntRef.current = updateList.length * 2 * 0.3;
    setMeanings(makeMeaningList(newExam.meaning, updateList));
    setTestList(tesReq.data);
    setNowExam(newExam);
    setReady(true);
  };

  useEffect(() => {
    if (!ready) {
      reqTest();
    }
    return () => {};
  }, [ready, reqTest]);

  if (!ready) return <></>;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div style={{ display: 'flex', fontSize: 35, fontWeight: '700', marginBottom: 40 }}>
        {nowExam.word}
      </div>
      <div>
        {processing} / {testList.words.length * 2}
      </div>
      <br />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
        }}
      >
        {meanings.map((item) => (
          <div
            onClick={() => {
              if (nowExam.meaning === item) {
                handleAnswer(true, item);
              } else {
                handleAnswer(false, item);
              }
            }}
            style={{
              color: item === nowExam.meaning ? 'red' : 'black',
              padding: 15,
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: 'green',
            }}
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default Test;

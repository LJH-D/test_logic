function Result() {
  const data = JSON.parse(window.localStorage.getItem('result')!);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>틀린 문제</h1>
        {data.fList.map((item: any, index: number) => {
          return (
            <div key={index}>
              <div>
                {index + 1}번 / {item.word} / {item.반복} / {item.랭크}
              </div>
            </div>
          );
        })}
        <h1>맞은 문제</h1>
        {data.sList.map((item: any, index: number) => {
          return (
            <div key={index}>
              <div>
                {index + 1}번 / {item.word} / {item.반복} / {item.랭크}
              </div>
            </div>
          );
        })}

        <h1>틀린문제 평균</h1>
        <div>틀린 문제 평균 반복 : {data.fEver}</div>
        <div>틀린 문제 평균 랭크 : {data.fRankEver}</div>
        <h1>맞은문제 평균</h1>
        <div>맞은 문제 평균 반복 : {data.sEver}</div>
        <div>맞은 문제 평균 랭크 : {data.sRankEver}</div>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default Result;

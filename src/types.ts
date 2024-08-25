export type WordProps = {
  id: number;
  word: string;
  meaning: string;
};
export type TestResponse = {
  vocabularyId: number;
  round: number;
  words: WordUpdateProps[];
};

export type WordUpdateProps = {
  id: number;
  word: string;
  meaning: string;
  rank: number;
  count: number;
  answerList?: string[];
  choiceMean: string;
  isPass?: boolean;
};

export type VocabularyStateProps = {
  vocabularyId: number;
  words: WordUpdateProps[];
};

export type TogetherResponseBody = {
  output: {
    result_type: string;
    choices: {
      text: string;
    }[];
  };
};

export type TogetherStreamResponseBody = {
  choices: {
    text: string;
  }[];
  id: string;
  token: {
    id: number;
    text: string;
    logprob: number;
    special: boolean;
  };
  generated_text: string | null;
  details: null;
  stats: null;
};

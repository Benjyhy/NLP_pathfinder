import axios, { AxiosError } from 'axios';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
};

export async function sendAudioSpeech(audio: string) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_RECOGNITION_URL}/recognise`,
      { audio: audio },
      { headers: headers },
    );
    return res;
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
      return error.response;
    } else {
      console.log(error);
    }
  }
}

export async function sendSpeech(sentence: string) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_NLP_URL}/recommendation`,
      { sentence: sentence },
      { headers: headers },
    );
    return res;
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
      return error.response;
    } else {
      console.log(error);
    }
  }
}

interface ISendFinder {
  departure: string;
  arrival: string;
}
export async function sendFinder({ departure, arrival }: ISendFinder) {
  console.log(departure);
  console.log(arrival);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_FINDER_URL}/pathfinder`,
      { departure: departure, arrival: arrival },
      { headers: headers },
    );
    return res;
  } catch (error: AxiosError | any) {
    if (axios.isAxiosError(error)) {
      console.log(error.response);
      return error.response;
    } else {
      console.log(error);
    }
  }
}

import { v4 as uuid } from 'uuid';

export default function generateKey() {
  return uuid();
}

export function formatMinutes(minutes: number) {
  return minutes < 10 ? `0${minutes}` : `${minutes}`;
}

export function formatSeconds(seconds: number) {
  return seconds < 10 ? `0${seconds}` : `${seconds}`;
}

export function blobToBase64(url: string): Promise<string> {
  return new Promise<string>(async (resolve, _) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileReader = new FileReader();

    fileReader.readAsDataURL(blob);

    fileReader.onloadend = function () {
      const base64 = fileReader.result as string;
      resolve(base64.substring(22));
    };
  });
}

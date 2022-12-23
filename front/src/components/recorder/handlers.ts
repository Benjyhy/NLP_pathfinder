import { SetRecordings, SetRecorder } from './types';

export async function startRecording(setRecorderState: SetRecorder) {
  try {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    setRecorderState(prevState => {
      return {
        ...prevState,
        initRecording: true,
        mediaStream: stream,
      };
    });
  } catch (err) {
    console.log(err);
  }
}

export async function AskForMicrophone() {
  try {
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    return true;
  } catch (err) {
    return false;
  }
}

export function saveRecording(recorder: any) {
  if (recorder.state !== 'inactive') recorder.stop();
}

export function deleteAudio(audioKey: string, setRecordings: SetRecordings) {
  setRecordings(prevState =>
    prevState.filter(record => record.key !== audioKey),
  );
}

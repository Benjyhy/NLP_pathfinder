import { Dispatch, SetStateAction } from 'react';

export type Recorder = {
  recordingSeconds: number;
  initRecording: boolean;
  mediaStream: MediaStream | null | undefined;
  mediaRecorder: MediaRecorder | null;
  audio: string | null;
};

export type UseRecorder = {
  recorderState: Recorder;
  startRecording: () => void;
  cancelRecording: () => void;
  saveRecording: () => void;
};

export type RecorderControlsProps = {
  recorderState: Recorder;
  info: JSX.Element;
  disableRecord: boolean;
  handlers: {
    startRecording: () => void;
    cancelRecording: () => void;
    saveRecording: () => void;
  };
  handleRecording: () => void;
};

export type RecordingsListProps = {
  recordings: Audio[];
  deleteAudio: (key: string) => void;
};

export type Audio = {
  key: string;
  audio: string;
};

export type Interval = null | number | ReturnType<typeof setInterval>;
export type SetRecorder = Dispatch<SetStateAction<Recorder>>;
export type SetRecordings = Dispatch<SetStateAction<Audio[]>>;
export type AudioTrack = MediaStreamTrack;
export type MediaRecorderEvent = {
  data: Blob;
};

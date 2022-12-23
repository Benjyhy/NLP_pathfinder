import React, { useEffect, useState } from 'react';
import useRecorder from '../components/recorder/hooks/useRecorder';
import useRecordingsList from '../components/recorder/hooks/useRecordingsList';
import RecorderControls from '../components/recorder/Recording';
import RecordingsList from '../components/recorder/recordingList';
import Button from '../components/Button';
import AudioRefused from '../components/AudioRefused';
import { Flex, Box } from 'reflexbox';
import { Back } from '../components/Back';
import { AskForMicrophone } from '../components/recorder/handlers';
import { UseRecorder } from '../components/recorder/types';
import { WARNING, PRIMARY_1, DANGER } from '../constants/style';
import { blobToBase64 } from '../helper/Utils';
import axios from 'axios';
import { sendSpeech, sendAudioSpeech, sendFinder } from '../helper/Service';
import Loader from '../components/Loader';
import { INotif, Notif } from '../components/Notif';

export const Recognise = () => {
  const [auth, setAuth] = useState<boolean>(true);
  // AskForMicrophone().then(res => {
  //   if (res === true) setAuth(true);
  // });

  const { recorderState, ...handlers }: UseRecorder = useRecorder();
  const { recordings, deleteAudio } = useRecordingsList(recorderState.audio);

  const [info, setInfo] = useState<JSX.Element>(<></>);
  const [loader, setLoader] = useState<boolean>(false);
  const [notif, setNotif] = useState<INotif>({
    content: undefined,
    type: undefined,
  });

  const handleRecording = () => {
    let seconds = 3;
    setInfo(
      <>
        Be ready to Speak in <span style={{ color: WARNING }}>{seconds}</span>{' '}
        seconds
      </>,
    );
    const delay = setInterval(() => {
      seconds--;
      setInfo(
        <>
          Be ready to Speak in <span style={{ color: WARNING }}>{seconds}</span>{' '}
          seconds
        </>,
      );
      if (seconds === 0) {
        setInfo(<span style={{ color: WARNING }}>Recording ...</span>);
        clearInterval(delay);
        handlers.startRecording();
      }
    }, 2000);

    // handlers.startRecording();
  };

  const handleSubmit = async () => {
    setLoader(true);
    // AUDIO SENTENCE
    const audio: string = await blobToBase64(recordings[0].audio);
    const speechRes = await sendAudioSpeech(audio);
    setLoader(false);
    if (!speechRes?.data.status) {
      setNotif({ content: 'Sometging went wrong', type: DANGER });
      return setLoader(false);
    }

    // SENTENCE TO NLP
    const sentence = speechRes?.data.sentence;
    const nlpRes = await sendSpeech(sentence);
    console.log(nlpRes);

    // NLP TO FINDER
    const res = nlpRes?.data.result;
    const finderRes = await sendFinder({
      departure: res.from,
      arrival: res.to,
    });
    console.log(finderRes);
  };

  return (
    <>
      <Back />
      {!auth && <AudioRefused />}
      {!loader && (
        <>
          <Notif content={notif.content} type={notif.type} />
          <Flex width='70vw' flexDirection='column'>
            <RecorderControls
              recorderState={recorderState}
              handlers={handlers}
              handleRecording={handleRecording}
              info={info}
              disableRecord={recordings.length === 0 && true}
            />
            <RecordingsList recordings={recordings} deleteAudio={deleteAudio} />

            {recordings?.length !== 0 && (
              <Flex
                py='4'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
              >
                <span>Dont forget to check if your audio is correct</span>
                <Button
                  content={'Envoyer votre audio'}
                  color={PRIMARY_1}
                  click={handleSubmit}
                />
              </Flex>
            )}
          </Flex>
        </>
      )}
      {loader && (
        <Flex>
          <Loader />
        </Flex>
      )}
    </>
  );
};

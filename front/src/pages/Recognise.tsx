import React, { useCallback, useEffect, useState } from 'react';
import useRecorder from '../components/recorder/hooks/useRecorder';
import useRecordingsList from '../components/recorder/hooks/useRecordingsList';
import RecorderControls from '../components/recorder/Recording';
import RecordingsList from '../components/recorder/recordingList';
import Button from '../components/Button';
import AudioRefused from '../components/AudioRefused';
import { Flex, Box } from 'reflexbox';
import { Layout } from '../components/Layout';
import { AskForMicrophone } from '../components/recorder/handlers';
import { UseRecorder } from '../components/recorder/types';
import { WARNING, PRIMARY_1, DANGER } from '../constants/style';
import { blobToBase64 } from '../helper/Utils';
import { sendSpeech, sendAudioSpeech, sendFinder } from '../helper/Service';
import Loader from '../components/Loader';
import { INotif, Notif, NotifDefaultState } from '../components/Notif';

interface IResult {
  paths?: string[];
  time?: string;
  to?: string;
  from?: string;
  message?: string;
}

export const Recognise = () => {
  const { recorderState, ...handlers }: UseRecorder = useRecorder();
  const { recordings, deleteAudio } = useRecordingsList(recorderState.audio);

  const [result, setResult] = useState<IResult | null>(null);
  const [info, setInfo] = useState<JSX.Element>(<></>);
  const [loader, setLoader] = useState<boolean>(false);
  const [notif, setNotif] = useState<INotif>(NotifDefaultState);

  useEffect(() => {
    if (notif != undefined) {
      setTimeout(() => {
        setNotif(NotifDefaultState);
      }, 1500);
    }
  }, [notif]);

  const handleRecording = () => {
    let seconds = 2;
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
    }, 1500);
  };

  useEffect(() => {
    if (recorderState.audio) {
      handleSubmit();
    }
  }, [recorderState.audio]);

  const handleRecorderState = useCallback(
    event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (recorderState.initRecording) {
          handlers.saveRecording();
        } else {
          handleRecording();
        }
      }
    },
    [recorderState],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleRecorderState, true);

    return () => {
      document.removeEventListener('keydown', handleRecorderState, true);
    };
  }, [handleRecorderState]);

  const handleSubmit = async () => {
    setLoader(true);
    // AUDIO SENTENCE
    const audio: string = await blobToBase64(recorderState.audio!);
    const speechRes = await sendAudioSpeech(audio);
    console.log(speechRes)
    if (!speechRes?.data.status) {
      setNotif({
        content: 'Something went wrong with the vocal recognition',
        type: DANGER,
      });
      setInfo(<></>);
      return setLoader(false);
    }

    // SENTENCE TO NLP
    const sentence = speechRes?.data.sentence;
    const nlpRes = await sendSpeech(sentence);
    console.log(nlpRes);
    if (!nlpRes?.data.status) {
      setNotif({
        content: 'Something went wrong in sentence recognition',
        type: DANGER,
      });
      setInfo(<></>);
      return setLoader(false);
    }
    if (!nlpRes?.data.result.hasOwnProperty("from") || !nlpRes?.data.result.hasOwnProperty("to") ) {
      setNotif({
        content: 'Could not recognise the departure and destination',
        type: DANGER,
      });
      setInfo(<></>);
      return setLoader(false);
    }

    // NLP TO FINDER
    const res = nlpRes?.data.result;
    setResult({ from: res.from, to: res.to });
    const finderRes = await sendFinder({
      departure: res.from,
      arrival: res.to,
    });
    console.log(finderRes);
    if (!finderRes?.data.status) {
      setNotif({ content: 'Something went wrong in pathFinder', type: DANGER });
      setResult({ message: finderRes?.data.message });
      setInfo(<></>);
      return setLoader(false);
    }
    if (finderRes?.data.message === 'not found') {
      setNotif({ content: 'Gare station not found', type: DANGER });
      setResult({ message: finderRes?.data.message });
      setInfo(<></>);
      return setLoader(false);
    }

    if (finderRes?.data.message === 'no trip') {
      setNotif({
        content: 'Sorry, we do not have train for your itinerary',
        type: DANGER,
      });
      setResult({ message: finderRes?.data.message });
      setInfo(<></>);
      return setLoader(false);
    }
    setResult(prevState => {
      return {
        ...prevState,
        paths: finderRes?.data.paths,
        time: finderRes?.data.time,
      };
    });
    setLoader(false);
  };

  return (
    <>
      <Layout />
      <Notif content={notif.content} type={notif.type} />
      {!loader && (
        <>
          <Flex width='70vw' flexDirection='column'>
            {!result && (
              <>
                <RecorderControls
                  title='Tell us your itinerary'
                  recorderState={recorderState}
                  handlers={handlers}
                  handleRecording={handleRecording}
                  info={info}
                  disableRecord={recordings.length === 0 && true}
                  allowStopAudio={true}
                />
                <RecordingsList
                  recordings={recordings}
                  deleteAudio={deleteAudio}
                />
              </>
            )}
            {result?.paths && (
              <Flex
                width={1}
                flexDirection={'column'}
                justifyContent={'space-between'}
                style={{
                  color: '#fff',
                }}
              >
                <Flex pb={4} flexDirection={'row'}>
                  <Flex alignItems={'center'} flexDirextion={'row'}>
                    <Box px={4}>From :</Box>
                    <h2>{result?.from}</h2>
                  </Flex>
                  <Flex alignItems={'center'} flexDirextion={'row'}>
                    <Box px={4}>To :</Box>
                    <h2>{result?.to}</h2>
                  </Flex>
                </Flex>
                <Flex justifyContent={'center'} alignItems={'center'} pb={4}>
                  <Box px={4}>Time estimed :</Box>
                  <h2>{result?.time}</h2>
                </Flex>
                <h2>Train changes</h2>
                <Flex flexDirection={'column'}>
                  {result?.paths!.map((path, key) => {
                    return (
                      <Box
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        py={2}
                        key={key}
                      >
                        <Flex
                          flexDirection={'column'}
                          justifyContent={'center'}
                          alignItems={'center'}
                        >
                          <span>{path}</span>
                          {key !== result.paths!.length - 1 && (
                            <>
                              <span>|</span>
                              <span>|</span>
                              <span>v</span>
                            </>
                          )}
                        </Flex>
                      </Box>
                    );
                  })}
                </Flex>
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

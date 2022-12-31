import React, { useCallback, useEffect, useState } from 'react';
import useRecorder from '../components/recorder/hooks/useRecorder';
import RecorderControls from '../components/recorder/Recording';
import Loader from '../components/Loader';
import { Flex } from 'reflexbox';
import { Layout } from '../components/Layout';
import { UseRecorder } from '../components/recorder/types';
import { WARNING, PRIMARY_1, DANGER } from '../constants/style';
import { blobToBase64 } from '../helper/Utils';
import { basicAuth, biometricAuth } from '../helper/Service';
import { INotif, Notif, NotifDefaultState } from '../components/Notif';
import { useNavigate } from 'react-router-dom';
import { AskForMicrophone } from '../components/recorder/handlers';
import AudioRefused from '../components/AudioRefused';
export { initialState } from '../components/recorder/hooks/useRecorder';

export const Login = () => {
  const [auth, setAuth] = useState<boolean>(false);
  AskForMicrophone().then(res => {
    if (res === true) setAuth(true);
  });
  const navigate = useNavigate();

  const { recorderState, ...handlers }: UseRecorder = useRecorder();
  const isBiometricAuth = JSON.parse(import.meta.env.VITE_BIOMETRIC_AUTH);

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
    }, 1000);
  };

  const handleRecorderState = useCallback(
    event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        recorderState.initRecording
          ? handlers.saveRecording()
          : handleRecording();
      }
    },
    [recorderState],
  );

  useEffect(() => {
    if (isBiometricAuth === false)
      document.addEventListener('keydown', handleRecorderState, true);

    return () => {
      document.removeEventListener('keydown', handleRecorderState, true);
    };
  }, [handleRecorderState]);

  useEffect(() => {
    if (recorderState.audio !== null && isBiometricAuth === false) {
      handleSubmit();
    }

    if (recorderState.recordingSeconds === 3 && isBiometricAuth === true) {
      handlers.saveRecording();
      handleSubmit();
    }
  }, [recorderState]);

  const handleSubmit = async () => {
    setLoader(true);
    const audio: string = await blobToBase64(recorderState.audio!);

    const authRes = isBiometricAuth
      ? await biometricAuth(audio)
      : await basicAuth(audio);

    console.log(authRes);

    if (!authRes?.data.status) {
      if (authRes?.data.failed) {
        setNotif({
          content: 'We could not hear you well, please try again !',
          type: DANGER,
        });
      } else {
        setNotif({ content: 'Unauthorized', type: DANGER });
      }
      handlers.cancelRecording();
      setInfo(<></>);
      setLoader(false);
      return;
    }

    localStorage.setItem('accessToken', authRes.data.token);
    setNotif({ content: `Welcome ${authRes?.data.user}`, type: PRIMARY_1 });
    setTimeout(() => {
      navigate('/recognise');
    }, 1500);
  };

  return (
    <>
      <Layout />
      <Notif content={notif.content} type={notif.type} />
      {!auth && <AudioRefused />}
      {!loader && (
        <>
          <Flex width='70vw' flexDirection='column'>
            <RecorderControls
              title='Say your Name to Login'
              recorderState={recorderState}
              handlers={handlers}
              handleRecording={handleRecording}
              info={info}
              disableRecord={recorderState.audio !== '' && true}
              allowStopAudio={isBiometricAuth ? false : true}
            />
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

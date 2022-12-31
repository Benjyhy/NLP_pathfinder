import React, { useEffect, useState, useRef } from 'react';
import useRecorder from '../components/recorder/hooks/useRecorder';
import useRecordingsList from '../components/recorder/hooks/useRecordingsList';
import RecorderControls from '../components/recorder/Recording';
import RecordingsList from '../components/recorder/recordingList';
import Button from '../components/Button';
import AudioRefused from '../components/AudioRefused';
import { Flex, Box } from 'reflexbox';
import { Layout } from '../components/Layout';
import { AskForMicrophone } from '../components/recorder/handlers';
import { Audio, UseRecorder } from '../components/recorder/types';
import { WARNING, PRIMARY_1, DANGER } from '../constants/style';
import { blobToBase64 } from '../helper/Utils';
import { addUser } from '../helper/Service';
import Loader from '../components/Loader';
import { INotif, Notif, NotifDefaultState } from '../components/Notif';
import Input from '../components/Input';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<boolean>(false);
  AskForMicrophone().then(res => {
    if (res === true) setAuth(true);
  });

  const { recorderState, ...handlers }: UseRecorder = useRecorder();
  const { recordings, deleteAudio } = useRecordingsList(recorderState.audio);

  const [info, setInfo] = useState<JSX.Element>(<></>);
  const user = useRef<HTMLInputElement | null>(null);
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
    // let seconds = 3;
    // setInfo(
    //   <>
    //     Be ready to Speak in <span style={{ color: WARNING }}>{seconds}</span>{' '}
    //     seconds
    //   </>,
    // );
    // const delay = setInterval(() => {
    //   seconds--;
    //   setInfo(
    //     <>
    //       Be ready to Speak in <span style={{ color: WARNING }}>{seconds}</span>{' '}
    //       seconds
    //     </>,
    //   );
    //   if (seconds === 0) {
    //     setInfo(<span style={{ color: WARNING }}>Recording ...</span>);
    //     clearInterval(delay);
    //     handlers.startRecording();
    //   }
    // }, 2000);
    handlers.startRecording();
  };

  const handleSubmit = async () => {
    setLoader(true);
    if (user.current?.value.length === 0) {
      setNotif({ content: 'Name can not be empty', type: DANGER });
      setLoader(false);
      return;
    }
    const audio: string[] = [];
    const username = user.current?.value;
    await Promise.all(
      recordings.map(async (record: Audio) => {
        audio.push(await blobToBase64(record.audio));
      }),
    );

    const registerRes = await addUser(audio, username!);
    console.log(registerRes);
    if (!registerRes?.data.status) {
      if (registerRes?.data.message) {
        setNotif({ content: 'User already exist', type: DANGER });
      } else {
        setNotif({ content: 'Unauthorized', type: DANGER });
      }
      handlers.cancelRecording();
      setLoader(false);
      setInfo(<></>);
      return;
    }
    setNotif({ content: `${username} has been added`, type: PRIMARY_1 });
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  useEffect(() => {
    if (recorderState.recordingSeconds === 2) {
      handlers.saveRecording();
      setInfo(<></>);
    }
  }, [recorderState.recordingSeconds]);

  return (
    <>
      <Layout />
      {!auth && <AudioRefused />}
      <Notif content={notif.content} type={notif.type} />
      {!loader && (
        <>
          <Flex width='70vw' flexDirection='column'>
            <h1>Register a new user</h1>
            <Box py='4'>
              <Input placeholder='Joris' refValue={user} />
            </Box>
            <RecorderControls
              title=''
              recorderState={recorderState}
              handlers={handlers}
              handleRecording={handleRecording}
              info={info}
              disableRecord={recordings.length < 3 && true}
              allowStopAudio={false}
            />
            <RecordingsList recordings={recordings} deleteAudio={deleteAudio} />

            {recordings?.length === 3 && (
              <Flex
                py='4'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
              >
                <span>Dont forget to check if your audios is correct</span>
                <Button
                  content={'Send'}
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

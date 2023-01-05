import React, { useEffect, useState } from 'react';
import MicrophoneIcon from '../../icons/Microphone';
import CloseIcon from '../../icons/CloseIcon';
import { formatSeconds } from '../../helper/Utils';
import { RecorderControlsProps } from './types';
import { Box, Flex } from 'reflexbox';
import RoundedButton from '../RoundedButton';

export default function RecorderControls({
  recorderState,
  handlers,
  info,
  handleRecording,
  disableRecord,
  title,
  allowStopAudio,
}: RecorderControlsProps) {
  const { recordingSeconds, initRecording } = recorderState;
  const { saveRecording } = handlers;

  return (
    <>
      {!disableRecord && <></>}
      {disableRecord && (
        <>
          <h1>{title}</h1>
          <Flex
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            py='4'
          >
            <Box>
              {initRecording && <div></div>}
              <span>{formatSeconds(recordingSeconds)}</span>
            </Box>
            <Box style={{ color: '#fff' }}>{info}</Box>
            {allowStopAudio && initRecording && (
              <RoundedButton
                width={35}
                title='Stop recording'
                onClick={saveRecording}
              >
                <CloseIcon />
              </RoundedButton>
            )}
            {!initRecording && (
              <Box>
                {Object.keys(info.props).length === 0 ? (
                  <RoundedButton
                    width={35}
                    title='Start recording'
                    onClick={handleRecording}
                    disabled={info.props.length === 0 && true}
                  >
                    <MicrophoneIcon />
                  </RoundedButton>
                ) : (
                  <Box></Box>
                )}
              </Box>
            )}
          </Flex>
        </>
      )}
    </>
  );
}

import React from 'react';
import TrashIcon from '../../icons/Trash';
import useRecordingsList from './hooks/useRecordingsList';
import { RecordingsListProps } from './types';
import { Flex, Box } from 'reflexbox';
import RoundedButton from '../RoundedButton';

export default function RecordingsList({
  recordings,
  deleteAudio,
}: RecordingsListProps) {
  return (
    <>
      {recordings.length > 0 ? (
        <Flex width={[1]} flexDirection='column'>
          <h1>Your recordings</h1>
          {recordings.map(record => (
            <Flex
              key={record.key}
              flexDirection='row'
              justifyContent='space-between'
              alignItems='center'
              py='4'
            >
              <audio controls src={record.audio} />
              <RoundedButton
                width={35}
                title='Delete this audio'
                onClick={() => deleteAudio(record.key)}
              >
                <TrashIcon />
              </RoundedButton>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Box>
          <span>You don't have records</span>
        </Box>
      )}
    </>
  );
}

import React from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams } from 'react-router-dom';
import { Button, Heading, Text, Flex } from '@chakra-ui/react';
import { useGetRoomTokenQuery } from '@store/services/projectShare';
import apiConfig from '@config/apiConfig';

const RoomComponent = () => {
  
  const [client, setClient] = React.useState(null);
  const [localUid, setLocalUid] = React.useState(null);
  const [localAudioTrack, setLocalAudioTrack] = React.useState(null);
  const [localAudioMuted, setLocalAudioMuted] = React.useState(false);
  const [remoteTracks, setRemoteTracks] = React.useState({});
  const { projectId } = useParams();
  const sessionid = projectId;
  // console.log('data', data);
  const { data, refetch, isFetching, isSuccess } = useGetRoomTokenQuery(projectId);


  const getToken = async () => {
    if (!isSuccess || !data) {
      await refetch();
    }
    return data;
  };

  const joinRoom = async () => {
    const { token, uid, channel } = await getToken();
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    agoraClient.on('user-published', handleUserJoined);
    agoraClient.on('user-left', handleUserLeft);
    agoraClient.on('volume-indicator', handleVolumeIndicator);
    agoraClient.enableAudioVolumeIndicator();
    
    await agoraClient.join(apiConfig.appID, channel, token || null, uid || null);
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setClient(agoraClient);
    setLocalUid(uid);
    setLocalAudioTrack(audioTrack);

    await audioTrack.setEnabled(true);
    await audioTrack.setMuted(localAudioMuted);

    // Publish audio track
    await agoraClient.publish([audioTrack]);

    // Show UI for audio controls
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('foot').style.display = 'flex';
  };

  const handleMicClick = async () => {
    if (localAudioTrack) {
      if (!localAudioMuted) {
        await localAudioTrack.setMuted(true);
        setLocalAudioMuted(true);
      } else {
        await localAudioTrack.setMuted(false);
        setLocalAudioMuted(false);
      }
    }
  };

  const handleLeaveButtonClick = async () => {
    if (client) {
      // Stop and close the audio track
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      
      await client.leave();
      setClient(null);
      setLocalAudioTrack(null);
      setLocalUid(null);
      setRemoteTracks({});

      // Navigate away
      navigate('/');
    }
  };

  const handleUserJoined = async (user, mediaType) => {
    // Handle audio only
    if (mediaType === 'audio') {
      await client.subscribe(user, mediaType);
      user.audioTrack.play();
      
      // Update remote tracks
      setRemoteTracks(prevTracks => ({
        ...prevTracks,
        [user.uid]: user
      }));
    }
  };

  const handleUserLeft = (user) => {
    // Remove user from remote tracks
    setRemoteTracks(prevTracks => {
      const newTracks = { ...prevTracks };
      delete newTracks[user.uid];
      return newTracks;
    });

    // Unsubscribe from the user
    client.unsubscribe(user);
  };

  const handleVolumeIndicator = (evt) => {
    evt.forEach(indicator => {
      const speaker = indicator.uid;
      const volume = indicator.level;
      // Update volume icon based on volume level
      const element = document.getElementById(`volume-${speaker}`);
      if (element) {
        element.src = volume > 0 ? '/img/assets/volume-on.svg' : '/img/assets/volume-off.svg';
      }
    });
  };

  return (
    <div className='room'>
      <Flex 
        id='join-wrapper'
        direction={'row'}
        justify={'space-around'}
        align={'center'}
        wrap={'wrap'}
      >
        <Heading>You are in the waiting room</Heading>
        <Text fontSize={'xl'}>Click the button below to join the meeting</Text>
        <Button width={'50%'} mt={4} bg='brand.700' color={'white'} fontSize={'x-large'} size={'lg'} onClick={joinRoom}>
          Join
        </Button>
      </Flex>
      <div id="foot" style={{ display: 'none' }}>
        <button id='mic-btn' onClick={handleMicClick}>
          <img height={20} width={20} src="/img/assets/microphone.svg" alt="Toggle Mic" />
        </button>
        <button id="leave-btn" onClick={handleLeaveButtonClick}>
          <img height={25} width={25} src="/img/assets/leave.svg" alt="Leave" />
        </button>
      </div>
    </div>
  );
};

export default RoomComponent;


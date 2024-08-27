import React, { useEffect } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Heading, Text, Flex, IconButton } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaSignOutAlt } from 'react-icons/fa';
import { useGetRoomTokenQuery } from '@store/services/projectShare';
import apiConfig from '@config/apiConfig';

const RoomComponent = ({ autoJoin = false }) => {
  
  const [client, setClient] = React.useState(null);
  const [localUid, setLocalUid] = React.useState(null);
  const [localAudioTrack, setLocalAudioTrack] = React.useState(null);
  const [localAudioMuted, setLocalAudioMuted] = React.useState(false);
  const [remoteTracks, setRemoteTracks] = React.useState({});
  const { projectId } = useParams();
  const navigate = useNavigate();
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
    // document.getElementById('join-wrapper').style.display = 'none';
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

    }
  };

  const handleUserJoined = async (user, mediaType) => {
    // Handle audio only
     if (!client || mediaType !== 'audio') return;
    if (mediaType === 'audio') {
      await client.subscribe(user, mediaType);
      if (user.audioTrack) {
        user.audioTrack.setVolume(100);
        user.audioTrack.play();
      } else {
        console.warn('No audio track found for the user');
      };

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
      if (client) {
      client.unsubscribe(user);
      }
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

    useEffect(() => {
    if (autoJoin) {
      joinRoom();
    }
  }, [autoJoin]);

 return (
   <Flex direction="column" align="center" p={4}>
      <Flex
        id="join-wrapper"
        direction="column"
        align="center"
        justify="center"
        display={autoJoin ? 'none' : 'flex'}
        p={4}
      >
        <Heading mb={4}>You are in the waiting room</Heading>
        <Text fontSize="xl" mb={4}>
          Click the button below to join the meeting
        </Text>
        <Button
          colorScheme="teal"
          size="lg"
          onClick={joinRoom}
        >
          Join
        </Button>
      </Flex>
      <Flex
        id="foot"
        display={autoJoin ? 'flex' : 'none'}
        direction="row"
        align="center"
        justify="center"
        p={4}
        gap={4}
      >
        <IconButton
          icon={localAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          aria-label="Toggle Mic"
          onClick={handleMicClick}
        />
        <IconButton
          icon={<FaSignOutAlt />}
          aria-label="Leave Room"
          onClick={handleLeaveButtonClick}
        />
      </Flex>
      <Flex direction="row" align="center" justify="center" p={4} gap={4}>
        {Object.keys(remoteTracks).map(uid => (
          <Flex key={uid} direction="column" align="center">
            <Text>{`User ${uid}`}</Text>
            <Icon
              as={volumeIndicators[uid] ? FaVolumeUp : FaVolumeMute}
              boxSize={6}
              color={volumeIndicators[uid] ? 'green.400' : 'red.400'}
              id={`volume-${uid}`}
            />
          </Flex>
        ))}
      </Flex>
    </Flex>  );
};

export default RoomComponent;


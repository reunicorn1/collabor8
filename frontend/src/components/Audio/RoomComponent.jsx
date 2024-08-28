import React, { useEffect } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Heading, Text, Flex, IconButton } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaSignOutAlt } from 'react-icons/fa';
import { useGetRoomTokenQuery } from '@store/services/projectShare';
import apiConfig from '@config/apiConfig';

const RoomComponent = ({ autoJoin = false }) => {

  const { projectId } = useParams();
  // console.log('data', data);
  const { data, refetch, isFetching, isSuccess } = useGetRoomTokenQuery(projectId);
  let localTracks = {
    audioTrack: null,
  }
  let localTrackState = {
    audioTrackMuted: false,
  }
  let localUid = null;
  let remoteTracks = {};
  let client = null;
  let remoteUid = null;
  const getToken = async () => {
    if (!isSuccess || !data) {
      await refetch();
    }
    return data;
  };

  const joinRoom = async () => {
    const { token, uid, channel } = await getToken();
    const config = {
      appid: apiConfig.appID,
      channel: channel,
      token: token,
      uid: uid
    };
    client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);
    // agoraClient.on('volume-indicator', handleVolumeIndicator);
    client.enableAudioVolumeIndicator();
    [config.uid, localTracks.audioTrack] = await Promise.all([
      client.join(config.appid, config.channel, config.token || null, config.uid || null),
      AgoraRTC.createMicrophoneAudioTrack()
    ]).catch(err => {
      console.error(err);
    });
    // agoraClient.on('user-published', async (user, mediaType) => {
    //   try {
    //     await handleUserJoined(user, mediaType);
    //   } catch (error) {
    //     console.error('Failed to subscribe to remote user:', error);
    //   }
    // });
    localUid = config.uid;
    try {
      if (localTracks.audioTrack) {
        await localTracks.audioTrack.setEnabled(true);
        await localTracks.audioTrack.setMuted(localAudioMuted);
        await agoraClient.publish([localTracks.audioTrack]);
      }
    } catch (error) {
      console.error('Failed to publish local tracks:', error);
    }

    // await audioTrack.setEnabled(true);
    // await audioTrack.setMuted(localAudioMuted);

    // Publish audio track
    await client.publish([localTracks.audioTrack]);

    // Show UI for audio controls
    // document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('foot').style.display = 'flex';
  };

  const handleMicClick = async () => {
    if (localTracks.audioTrack) {
      const newMutedStatus = !localTrackState.audioTrackMuted;
      await localTracks.audioTrack.setMuted(newMutedStatus);
      localTrackState.audioTrackMuted = newMutedStatus;

    }
  };

  const handleLeaveButtonClick = async () => {
    for (const trackName in localTracks) {
      let track = localTracks[trackName];
      if (track) {
        track.stop();
        track.close();
        localTracks[trackName] = null;
        track = null;
      }
    }

    if (client) {
      // Stop and close the audio track
      if (localTracks.audioTrack) {
        localTracks.audioTrack.stop();
        localTracks.audioTrack.close();
      }
      if (client) {
       await client.leave();
      }

      client = null
      localTracks = {
        audioTrack: null,
      };
      localTrackState = {
        audioTrackMuted: false,
      };
      localUid = null;
      remoteTracks = {};

    } else {
      console.warn('AgoraRTC client is not initialized');
    }
  };

  const handleUserJoined = async (user, mediaType) => {
    // Handle audio only
    console.error('user', user);
    if ((!client) || mediaType !== 'audio') return;
    if (client) {
      await client.subscribe(user, mediaType)
    }
    if (user.audioTrack) {
      user.audioTrack.play();
    } else {
      console.warn('No audio track found for the user');
    };

    // Update remote tracks
    remoteTracks[user.uid] = user;
  };

  const handleUserLeft = (user) => {
    // Remove user from remote tracks
    if (remoteTracks[user.uid]) {
      const audioTrack = remoteTracks[user.uid].audioTrack;
        if (audioTrack) {
            audioTrack.stop();
        }

      const newRemoteTracks = { ...remoteTracks };
      delete newRemoteTracks[user.uid];
      remoteTracks = newRemoteTracks;
    }
    // Unsubscribe from the user
    if (client) {
      client.unsubscribe(user);
    }
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
          icon={localTrackState.audioTrackMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
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


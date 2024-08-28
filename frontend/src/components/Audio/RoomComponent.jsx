import React, { useEffect, useState } from 'react';
import AgoraRTC from "agora-rtc-sdk-ng";
import { useParams } from 'react-router-dom';
import { Button, Heading, Text, Flex, IconButton } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaSignOutAlt } from 'react-icons/fa';
import { useGetRoomTokenQuery } from '@store/services/projectShare';
import apiConfig from '@config/apiConfig';

const RoomComponent = ({ autoJoin = false, onClose }) => {

  const { projectId } = useParams();
  // console.log('data', data);
  const { data, refetch, isFetching, isSuccess } = useGetRoomTokenQuery(projectId);
  const [joined, setJoined] = React.useState(autoJoin);
  const [_, setToggle] = useState(false);

  const forceUpdate = () => {
    setToggle(prev => !prev); // Toggle state to trigger re-render
  };
  let rtc = {
    client: null,
    audioTrack: null,
    audioTrackMuted: false,
    remoteUsers: {},
    remoteAudioTracks: {},
    localUid: null,
    remoteUid: null,
    remoteTracks: {}
  };

  const getToken = async () => {
    if (!isSuccess || !data) {
      await refetch();
    }
    console.log('data', data);
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
    rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    rtc.client.on('user-published', handleUserPublished);
    rtc.client.on('user-joined', handleUserJoined);
    rtc.client.on('user-left', handleUserLeft);
    rtc.client.on('user-unpublished', handleUserUnpublished);
    // agoraClient.on('volume-indicator', handleVolumeIndicator);
    rtc.client.enableAudioVolumeIndicator();
    [config.uid, rtc.audioTrack] = await Promise.all([
      rtc.client.join(config.appid, config.channel, config.token || null, config.uid || null),
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
    rtc.localUid = config.uid;
    try {
      if (rtc.audioTrack) {
        await rtc.audioTrack.setEnabled(true);
        await rtc.audioTrack.setMuted(rtc.audioTrackMuted);
        await rtc.client.publish([rtc.audioTrack]);
      }
    } catch (error) {
      console.error('Failed to publish local tracks:', error);
    }

    // await audioTrack.setEnabled(true);
    // await audioTrack.setMuted(localAudioMuted);

    // Publish audio track
    // await client.publish([localTracks.audioTrack]);

    // Show UI for audio controls
    // document.getElementById('join-wrapper').style.display = 'none';
    setJoined(true);
    document.getElementById('foot').style.display = 'flex';
  };

  const handleMicClick = async () => {
    if (rtc.audioTrack) {
      const newMutedStatus = !rtc.audioTrackMuted;
      await rtc.audioTrack.setMuted(newMutedStatus);
      rtc.audioTrackMuted = newMutedStatus;

    }
  };

  const handleUserUnpublished = (user) => {
    if (rtc.remoteTracks[user.uid]) {
      const audioTrack = rtc.remoteTracks[user.uid].audioTrack;
      if (audioTrack) {
        audioTrack.stop();
      }
      delete rtc.remoteTracks[user.uid];
    }
    rtc.client.publish([rtc.audioTrack]);
  }

  const handleUserPublished = async (user, mediaType) => {
    if ((!rtc.client) || mediaType !== 'audio') return;
    await rtc.client.subscribe(user, mediaType);
    if (user.audioTrack) {
      user.audioTrack.play();
    } else {
      console.warn('No audio track found for the user');
    }
    rtc.remoteTracks[user.uid] = user;
  }


  const handleLeaveButtonClick = async () => {

    setJoined(false);
    document.getElementById('foot').style.display = 'none';
    if (rtc.audioTrack) {
      rtc.audioTrack.stop();
      rtc.audioTrack.close();
      rtc.audioTrack = null;
    }



  if (rtc.client) {
    console.log('Leaving the room');
    await rtc.client.leave();
    console.log('Successfully left the room');
  } else {
    console.warn('client is null');
  }

  for (const uid in rtc.remoteTracks) {
    const user = rtc.remoteTracks[uid];
    if (user.audioTrack) {
      user.audioTrack.stop();
    }
  }

  rtc.client = null;
  rtc.audioTrackMuted = false;
  rtc.remoteTracks = {};
  rtc.localUid = null;
  rtc.remoteUid = null;

  onClose();
  forceUpdate();

};

const handleUserJoined = async (user, mediaType) => {
  // Handle audio only
  if ((!rtc.client) || mediaType !== 'audio') return;
  if (rtc.client) {
    await rtc.client.subscribe(user, mediaType)
  }
  if (user.audioTrack) {
    user.audioTrack.play();
  } else {
    console.warn('No audio track found for the user');
  };

  // Update remote tracks
  rtc.remoteTracks[user.uid] = user;
};

const handleUserLeft = (user) => {
  // Remove user from remote tracks
  if (rtc.remoteTracks[user.uid]) {
    const audioTrack = rtc.remoteTracks[user.uid].audioTrack;
    if (audioTrack) {
      audioTrack.stop();
    }

    delete rtc.remoteTracks[user.uid];
  }
  // Unsubscribe from the user
  if (rtc.client) {
    rtc.client.unsubscribe(user);
  }
};



useEffect(() => {
  if (autoJoin) {
    joinRoom();
  }
  return () => {
    // Cleanup function to leave the room and stop tracks
    if (rtc.client) {
      rtc.client.leave().catch(error => console.error('Error leaving room:', error));
    }
    if (rtc.audioTrack) {
      rtc.audioTrack.stop();
      rtc.audioTrack.close();
    }
  };
}, [autoJoin]);

return (
  <Flex direction="column" align="center" >
    <Flex
      id="join-wrapper"
      direction="column"
      align="center"
      justify="center"
      display={joined ? 'none' : 'flex'}
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
      display={joined ? 'flex' : 'none'}
      direction="row"
      align="center"
      justify="center"
      p={4}
      gap={4}
    >
      <IconButton
        icon={rtc.audioTrackMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        aria-label="Toggle Mic"
        onClick={handleMicClick}
      />
      <IconButton
        icon={<FaSignOutAlt />}
        aria-label="Leave Room"
        onClick={handleLeaveButtonClick}
      />
    </Flex>
  </Flex>);
};
export default RoomComponent;


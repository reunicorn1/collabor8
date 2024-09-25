import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, IconButton } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaSignOutAlt } from 'react-icons/fa';
import { useGetRoomTokenQuery } from '@store/services/projectShare';
import apiConfig from '@config/apiConfig';

const RoomComponent = ({ autoJoin = false, onClose }) => {
  const { projectId } = useParams();
  const { data, refetch, isSuccess } = useGetRoomTokenQuery(projectId);
  const [joined, setJoined] = useState(autoJoin);
  const rtcRef = useRef(null); // Use useRef for rtc
  const [rtcInitialized, setRtcInitialized] = useState(false);
  const [audioTrackMuted, setAudioTrackMuted] = useState(false);
  const [_, setToggle] = useState(false);
  let AgoraRTC;
  
  const forceUpdate = () => {
    setToggle((prev) => !prev); // Toggle state to trigger re-render
  };

  const getToken = async () => {
    if (!isSuccess || !data) {
      await refetch();
    }
    return data;
  };

  const initializeRtc = async () => {
    AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    return {
      client: AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }),
      audioTrack: null,
      audioTrackMuted: false,
      remoteTracks: {},
    };
  };

  const joinRoom = async () => {
    const data = await getToken();
    const { token, uid, channel } = data;

    if (!rtcInitialized) {
      rtcRef.current = await initializeRtc(); // Store RTC in ref
      setRtcInitialized(true);
    }

    const config = {
      appid: apiConfig.appID,
      channel: channel,
      token: token,
      uid: uid,
    };

    const agoraClient = rtcRef.current.client;
    agoraClient.on('user-published', handleUserPublished);
    agoraClient.on('user-joined', handleUserJoined);
    agoraClient.on('user-left', handleUserLeft);
    agoraClient.on('user-unpublished', handleUserUnpublished);
    agoraClient.enableAudioVolumeIndicator();
    
    await agoraClient.join(config.appid, config.channel, config.token || null, config.uid || null);
    rtcRef.current.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    setJoined(true);
    await agoraClient.publish([rtcRef.current.audioTrack]);
    document.getElementById('foot').style.display = 'flex';
  };

  const handleMicClick = async () => {
    console.log('Mic Clicked: ', rtcRef.current.audioTrackMuted);
    const rtc = rtcRef.current; // Get current rtc from ref
    if (rtc.audioTrack) {
      const newMutedStatus = !rtc.audioTrackMuted;
      await rtc.audioTrack.setMuted(newMutedStatus);
      rtc.audioTrackMuted = newMutedStatus;
      setAudioTrackMuted(newMutedStatus);
    }
  };

  const handleUserUnpublished = async (user) => {
    const rtc = rtcRef.current; // Get current rtc from ref
    if (rtc.remoteTracks[user.uid]) {
      const audioTrack = rtc.remoteTracks[user.uid].audioTrack;
      if (audioTrack) {
        audioTrack.stop();
      }
      delete rtc.remoteTracks[user.uid];
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    const rtc = rtcRef.current; // Get current rtc from ref
    if (!rtc.client || mediaType !== 'audio') return;
    await rtc.client.subscribe(user, 'audio');
    if (user.audioTrack) {
      user.audioTrack.play();
    }
    rtc.remoteTracks[user.uid] = user;
    // logic adding user avatar to the list for local user
  };

  const handleLeaveButtonClick = async () => {
    const rtc = rtcRef.current; // Get current rtc from ref
    setJoined(false);
    setRtcInitialized(false);
    document.getElementById('foot').style.display = 'none';
    if (rtc?.audioTrack) {
      rtc.audioTrack.stop();
      rtc.audioTrack.close();
      rtc.audioTrack = null;
    }

    if (rtc?.client) {
      await rtc.client.leave();
    }

    for (const uid in rtc.remoteTracks) {
      const user = rtc.remoteTracks[uid];
      if (user.audioTrack) {
        user.audioTrack.stop();
      }
    }
    // logic removing user avatar from the list for local user

    rtc.client = null;
    rtc.audioTrackMuted = false;
    rtc.remoteTracks = {};

    onClose();
    forceUpdate();
  };

  const handleUserJoined = async (user, mediaType) => {
    const rtc = rtcRef.current; // Get current rtc from ref
    if (!rtc.client || mediaType !== 'audio') return;
    if (rtc.client) {
      await rtc.client.subscribe(user, mediaType);
    }
    if (user.audioTrack) {
      user.audioTrack.play();
    }
    // logic adding user avatar to the list for remote user
    rtc.remoteTracks[user.uid] = user;
  };

  const handleUserLeft = (user) => {
    const rtc = rtcRef.current; // Get current rtc from ref
    if (rtc.remoteTracks[user.uid]) {
      const audioTrack = rtc.remoteTracks[user.uid].audioTrack;
      if (audioTrack) {
        audioTrack.stop();
      }
      delete rtc.remoteTracks[user.uid];
    }
    // logic removing user avatar from the list for remote user
    if (rtc.client) {
      rtc.client.unsubscribe(user);
    }
  };

  useEffect(() => {
    if (autoJoin) {
      joinRoom();
    }
    return () => {
      const rtc = rtcRef.current; // Get current rtc from ref
      if (rtc && rtc.client) {
        rtc.client.leave().catch((error) => console.error('Error leaving room:', error));
      }
      if (rtc && rtc.audioTrack) {
        rtc.audioTrack.stop();
        rtc.audioTrack.close();
      }
    };
  }, [autoJoin]);

  return (
    <Flex direction="column" align="center">
      <Flex
        id="join-wrapper"
        align="center"
        justify="center"
        display={joined ? 'none' : 'flex'}
      >
        <Button
          colorScheme="orange"
          size="sm"
          fontFamily="mono"
          onClick={joinRoom}
        >
          Join Voice Call
        </Button>
      </Flex>
      <Flex
        id="foot"
        display={joined ? 'flex' : 'none'}
        direction="row"
        align="center"
        justify="center"
        p={4}
        pt={0}
        pb={0}
        gap={4}
      >
        <IconButton
          icon={audioTrackMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          aria-label="Toggle Mic"
          onClick={handleMicClick}
        />
        <IconButton
          icon={<FaSignOutAlt />}
          aria-label="Leave Room"
          onClick={handleLeaveButtonClick}
        />
      </Flex>
    </Flex>
  );
};

export default RoomComponent;


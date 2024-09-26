import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, IconButton } from '@chakra-ui/react';
import { FaMicrophone, FaMicrophoneSlash, FaSignOutAlt } from 'react-icons/fa';
import { useGetRoomTokenQuery } from '@store/services/projectShare';
import apiConfig from '@config/apiConfig';
import { useSelector } from 'react-redux';
import { selectUserDetails } from '@store/selectors/userSelectors';
import { useLazyGetFriendByIdQuery } from '@store/services/user';


const RoomComponent = ({ autoJoin = false, onClose }) => {
  const { projectId } = useParams();
  const { data, refetch, isSuccess } = useGetRoomTokenQuery(projectId);
  const [joined, setJoined] = useState(autoJoin);
  const rtcRef = useRef(null); // Use useRef for rtc
  const [rtcInitialized, setRtcInitialized] = useState(false);
  const [audioTrackMuted, setAudioTrackMuted] = useState(false);
  const [_, setToggle] = useState(false);
  const userDetails = useSelector(selectUserDetails);
  const [userCount, setUserCount] = useState(0);
  const [getFriendById] = useLazyGetFriendByIdQuery();
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
      users: {},
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
    // agoraClient.on('user-joined', handleUserJoined);
    agoraClient.on('user-left', handleUserLeft);
    agoraClient.on('user-unpublished', handleUserUnpublished);
    agoraClient.enableAudioVolumeIndicator();
    await agoraClient.join(config.appid, config.channel, config.token || null, config.uid || null);
    rtcRef.current.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    rtcRef.current.users[uid] = {
      username: userDetails.username,
      profile_picture: userDetails.profile_picture,
    };

    setJoined(true);
    await agoraClient.publish([rtcRef.current.audioTrack]);
    addAvatar(rtcRef.current.client.uid);
    document.getElementById('foot').style.display = 'flex';
  };




  const addAvatar = (uid, isMuted = false) => {
    const rtc = rtcRef.current;
    // check if wrapper already exists
    if (document.getElementById(`user-avatar-wrapper-${uid}`)) {
      handleAvatarToggle(uid, isMuted);
      return;
    }
    const userAvatarWrapper = document.createElement('div');
    userAvatarWrapper.id = `user-avatar-wrapper-${uid}`;

    const userAvatar = document.createElement('div');
    userAvatar.id = `user-avatar-${uid}`;
    const user = rtc.users[uid];

    const numUsers = Object.keys(rtc.remoteTracks).length + 1;
    const hasAvatar = !!user.profile_picture;
    const avatarSrc = hasAvatar
      ? user.profile_picture
      : `../public/avatar-${(numUsers % 4)}.png`;

    userAvatarWrapper.className = `relative flex flex-start user-avatar-wrapper flex-shrink-0 w-10 h-10 rounded-full ${isMuted ? 'border-red-500' : 'border-green-500'} border-2 items-center justify-center bg-gray-100 overflow-hidden`;
    userAvatar.className = 'user-avatar flex-shrink-0 w-8 h-8 rounded-full overflow-hidden';
    userAvatar.innerHTML = `<img src="${avatarSrc}" alt="User Avatar" class="w-full h-full object-cover"/>`;

    userAvatarWrapper.appendChild(userAvatar);

    if (isMuted) {
      const muteLine = document.createElement('div');
      muteLine.className = 'absolute top-0 left-0 w-full h-full bg-red-500 opacity-50 transform rotate-45';
      userAvatarWrapper.appendChild(muteLine);
    }
    document.getElementById('users-avatars').appendChild(userAvatarWrapper);
  }

  const removeAvatar = (uid) => {
    const userAvatarWrapper = document.getElementById(`user-avatar-wrapper-${uid}`);
    if (userAvatarWrapper) {
      userAvatarWrapper.remove();
    }
  };

  const handleAvatarToggle = (uid, isMuted) => {
    const userAvatarWrapper = document.getElementById(`user-avatar-wrapper-${uid}`);

    if (userAvatarWrapper) {
      userAvatarWrapper.classList.toggle('border-green-500', !isMuted);
      userAvatarWrapper.classList.toggle('border-red-500', isMuted);

      // Handle the diagonal mute line
      const existingMuteLine = userAvatarWrapper.querySelector('.mute-line');
      if (isMuted) {
        if (!existingMuteLine) {
          const muteLine = document.createElement('div');
          muteLine.className = 'mute-line absolute top-0 left-0 w-full h-full bg-red-500 opacity-50 transform rotate-45';
          userAvatarWrapper.appendChild(muteLine);
        }
      } else if (existingMuteLine) {
        existingMuteLine.remove();
      }
    }
  }

  const handleMicClick = async () => {
    const rtc = rtcRef.current;

    if (rtc.audioTrack) {
      const newMutedStatus = !rtc.audioTrackMuted;
      await rtc.audioTrack.setMuted(newMutedStatus);
      rtc.audioTrackMuted = newMutedStatus;

      const uid = rtc.client.uid; // Local user's UID
      // handleAvatarToggle(uid, newMuted);
      setAudioTrackMuted(newMutedStatus);
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    const rtc = rtcRef.current; // Get current rtc from ref
    const  data = await getFriendById(user.uid).unwrap();
    console.log('User Published: ', data);

    if (!rtc.client || mediaType !== 'audio') return;

    await rtc.client.subscribe(user, 'audio');

    if (user.audioTrack) {
      user.audioTrack.play();
    }

    rtc.remoteTracks[user.uid] = user;
    rtc.users[user.uid] = {
      username: data.username,
      profile_picture: data.profile_picture,
    };

    console.log('Number of Remote Tracks: ', Object.keys(rtc.remoteTracks).length);
    // logic adding user avatar to the list for local user
    const isMuted = user.audioTrack.isMuted || false;
    addAvatar(user.uid, isMuted);
  };

  const handleUserUnpublished = async (user) => {
    const rtc = rtcRef.current; // Get current rtc from ref
    if (rtc.remoteTracks[user.uid]) {
      const audioTrack = rtc.remoteTracks[user.uid].audioTrack;     
      const isMuted = audioTrack?.isMuted || true;
      handleAvatarToggle(user.uid, isMuted);
      if (audioTrack) {
        audioTrack.stop();
      }

      // delete rtc.remoteTracks[user.uid];
    }
    // removeAvatar(user.uid);

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
    removeAvatar(rtc.client.uid);

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
    for (const uid in rtc.remoteTracks) {
      removeAvatar(uid);
    }
    rtc.client = null;
    rtc.audioTrackMuted = false;
    rtc.remoteTracks = {};

    onClose();
    forceUpdate();
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
    removeAvatar(user.uid);
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
        direction="column"
        align="center"
        justify="center"
        p={4}
        pt={0}
        pb={0}
        gap={4}
      >
        <Flex id="users-avatars" className='flex space-x-2'>
        </Flex>
        <Flex
          className="flex flex-row items-center justify-center p-4 gap-4"
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
    </Flex>
  );
};

export default RoomComponent;

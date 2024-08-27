import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useGetRoomTokenQuery } from '@store/services/projectShare';


const JitsiMeet = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const jitsiRef = useRef(null);
  const apiRef = useRef(null);
  const { projectId } = useParams();
  // const { data, refetch, isFetching, isSuccess } = useGetRoomTokenQuery(projectId);
  // console.log('data', data);

    


  const domain = 'meet.jit.si';
  const options = {
    startWithVideoMuted: true,
    startWithAudioMuted: true,
    disableDeepLinking: true,
    disableThirdPartyRequests: true,
    enableWelcomePage: false,
    enableUserRolesBasedOnToken: false,
    prejoinPageEnabled: false,
    enableClosePage: false,
    enableInsecureRoomNameWarning: false,
    enableNoisyMicDetection: true,
    enableNoAutoPlay: true,
    }
  useEffect(() => {
    // cleanup
    if (apiRef.current) {
      apiRef.current.removeEventListener('videoConferenceJoined', handleVideoConferenceJoined);
      apiRef.current.removeEventListener('videoConferenceLeft', handleVideoConferenceLeft);
      apiRef.current.removeEventListener('participantJoined', handleParticipantJoined);
    }
  }, []);

  // useEffect(() => {
  //   if (isJoined) {
  //     apiRef.current.executeCommand('toggleAudio');
  //     setIsMuted(true);
  //   }
  // }, [isJoined]);
    
  const handleApiReady = externalApi => {
    apiRef.current = externalApi;
    if (apiRef.current) {
      apiRef.current.executeCommand("mute", ["audio"]);

      apiRef.current.addEventListener('participantJoined', handleParticipantJoined);
      apiRef.current.addEventListener('videoConferenceJoined', handleVideoConferenceJoined);
      apiRef.current.addEventListener('videoConferenceLeft', handleVideoConferenceLeft);

    }
  }

  const handleVideoConferenceJoined = () => {
    setIsJoined(true);
  }

  const handleVideoConferenceLeft = () => {
    setIsJoined(false);
  }

  const handleParticipantJoined = (participant) => {
    console.log('participant', participant);
  }

  const handleToggleAudio = () => {
    apiRef.current.executeCommand('toggleAudio');
    setIsMuted(!isMuted);
  }

  const handleToggleVideo = () => {
    apiRef.current.executeCommand('toggleVideo');
  }

  const handleEndCall = () => {
    apiRef.current.executeCommand('hangup');
  }

  const handleToggleFullScreen = () => {
    apiRef.current.executeCommand('toggleFullScreen');
  }

  const handleToggleChat = () => {
    apiRef.current.executeCommand('toggleChat');
  }

  const handleToggleParticipants = () => {
    apiRef.current.executeCommand('toggleParticipantsPane');
  }
  
  const handleToggleTileView = () => {
    apiRef.current.executeCommand('toggleTileView');
  }

  const handleToggleShareScreen = () => {
    apiRef.current.executeCommand('toggleShareScreen');
  }

  const handleToggleRaiseHand = () => {
    apiRef.current.executeCommand('toggleRaiseHand');
  }

  const handleToggleRecording = () => {
    apiRef.current.executeCommand('toggleRecording');
  }

  // console.log('data', data);
  // const roomToken =  null;
  // console.log('roomToken', roomToken);
  // console.log('data', data);


  return (
    <JitsiMeeting
     getIFrameRef = { iframeRef => { iframeRef.style.height = '700px'; } }
      roomName={projectId}
      displayName='My Name'
      // jwt={roomToken}
      domain={domain}
      loadingComponent={<div>Loading...</div>}
      errorComponent={<div>Error</div>}
      containerStyle={{ width: '100%', height: '800px', 
      display: 'flex', flexDirection: 'column',
        position: 'relative', flex: '1'
        
      }}
    style={{ width: '100%', height: '800px', flex: '1', position: 'relative'}}
      configOverwrite={options}
      interfaceConfigOverwrite={{ filmStripOnly: false }}
      onApiReady={handleApiReady}
    />
  );



};

export default JitsiMeet;


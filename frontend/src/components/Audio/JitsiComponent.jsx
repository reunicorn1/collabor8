import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const JitsiMeetComponent = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const jitsiRef = useRef(null);
  const apiRef = useRef(null);
  const { projectId } = useParams();
  
  const handleJoin = () => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: 'MyUniqueRoomName', // Replace with dynamic room name if needed
      width: '100%',
      height: '600px',
      parentNode: jitsiRef.current,
      configOverwrite: {
        startWithVideoMuted: true,
      },
      interfaceConfigOverwrite: {
        FILMSTRIP_MAX_HEIGHT: 150,
      },
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
    apiRef.current.addEventListener('videoConferenceJoined', () => {
      setIsJoined(true);
    });
    apiRef.current.addEventListener('videoConferenceLeft', () => {
      setIsJoined(false);
      setIsMuted(false);
    });
  };

  const handleMuteToggle = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('toggleAudio');
      setIsMuted(!isMuted);
    }
  };

  const handleLeave = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand('hangup');
    }
  };

  return (
    <div>
      <div ref={jitsiRef} style={{ height: '600px' }}></div>
      {!isJoined ? (
        <button onClick={handleJoin}>Join Room</button>
      ) : (
        <div>
          <button onClick={handleMuteToggle}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
          <button onClick={handleLeave}>Leave Room</button>
        </div>
      )}
    </div>
  );
};

export default JitsiMeetComponent;


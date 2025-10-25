
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const VideoChatPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let localStream: MediaStream;

        const startVideo = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(localStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStream;
                }
                // --- WebRTC Simulation ---
                // In a real app, you'd establish a PeerConnection here.
                // For this simulation, we'll just mirror the local stream to the remote view.
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = localStream;
                }
                // -------------------------
            } catch (error) {
                console.error("Error accessing media devices.", error);
                alert("Could not access camera and microphone. Please check permissions.");
                navigate(`/chat/${userId}`);
            }
        };

        startVideo();

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, [userId, navigate]);

    const handleToggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };
    
    const handleEndCall = () => {
        stream?.getTracks().forEach(track => track.stop());
        navigate(`/chat/${userId}`);
    };

    return (
        <div className="relative h-screen bg-black text-white flex flex-col">
            {/* Remote Video */}
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            
            {/* Local Video */}
            <video ref={localVideoRef} autoPlay playsInline muted className="absolute top-4 right-4 w-1/4 max-w-[150px] rounded-lg shadow-lg border-2 border-white"></video>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-center items-center gap-4">
                <button onClick={handleToggleMute} className={`p-4 rounded-full ${isMuted ? 'bg-white text-black' : 'bg-gray-700'}`}>
                    {/* Mute/Unmute Icon */}
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isMuted ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />}
                    </svg>
                </button>
                <button onClick={handleEndCall} className="p-4 bg-red-600 rounded-full">
                     {/* End Call Icon */}
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2 2m-2-2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V6m0 0L6 8m-2-2l2-2" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default VideoChatPage;

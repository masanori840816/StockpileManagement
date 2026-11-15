import { useEffect, useRef } from 'react';
import type { JSX } from 'react/jsx-runtime';

export function RegisterPage(): JSX.Element {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        let webcamStream: MediaStream | null = null;

        const startWebcam = async (): Promise<void> => {
            try {
                webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = webcamStream;
                }
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };
        startWebcam();
    }, []);
    
    return (
        <div>
            <h1>Register Page</h1>
            <div>
                <video ref={videoRef} autoPlay muted></video>
            </div>
        </div>
    );
}
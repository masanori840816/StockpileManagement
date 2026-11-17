import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { BrowserMultiFormatOneDReader, type IScannerControls } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';

export function RegisterPage(): JSX.Element {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [barcodeValue, setBarcodeValue] = useState('');
    useEffect(() => {
        let webcamStream: MediaStream | null = null;
        const codeReader = new BrowserMultiFormatOneDReader();
        let controls: IScannerControls | null = null;
        const startWebcam = async (): Promise<void> => {
            try {
                webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = webcamStream;
                    controls = await codeReader.decodeFromVideoDevice(
                    undefined,
                    videoRef.current,
                    (result, error) => {
                        if (result) {
                            setBarcodeValue(result.getText());
                            console.log('Success:', result.getText());
                        }
                        if (error && !(error instanceof NotFoundException)) {
                            console.error('Error reading barcode:', error);
                        }
                    }
                    );
                }
            } catch (error) {
                console.error('Error accessing webcam:', error);
            }
        };
        startWebcam();
        return () => {
            if (controls) {
                controls.stop();
            }
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    
    return (
        <div>
            <h1>Register Page</h1>
            <div>
                <div>Scanned Barcode: {barcodeValue}</div>
                <video ref={videoRef} autoPlay muted></video>
            </div>
        </div>
    );
}
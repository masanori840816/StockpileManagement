import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { BrowserMultiFormatOneDReader, type IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';

const hints = new Map<DecodeHintType, unknown>([
    [DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8, 
        BarcodeFormat.UPC_A, 
        BarcodeFormat.UPC_E, 
        BarcodeFormat.CODE_128, 
        BarcodeFormat.CODE_39,
        BarcodeFormat.ITF,
    ]],
]);
export function RegisterPage(): JSX.Element {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [barcodeValue, setBarcodeValue] = useState('');
    useEffect(() => {
        const video = videoRef.current;
        if(video == null) {
            return;
        }
        let cancelled = false;
        let webcamStream: MediaStream | null = null;

        const codeReader = new BrowserMultiFormatOneDReader(hints);
        let scannerControls: IScannerControls | null = null;
        let lastBarcodeValue: string | null = null;
        const startWebcam = async (): Promise<void> => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment", 
                        width: { ideal: 1920 }, 
                        height: { ideal: 1080 } } });
                if (cancelled) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }
                webcamStream = stream;
                video.srcObject = webcamStream;
                const controls = await codeReader.decodeFromVideoElement(
                    video,
                    (result, error) => {
                        if (result && result.getText() !== lastBarcodeValue) {
                            setBarcodeValue(result.getText());
                            lastBarcodeValue = result.getText();
                            console.log('Success:', result.getText());
                        }
                        if (error && !(error instanceof NotFoundException)) {
                            console.error('Error reading barcode:', error);
                        }
                    }
                );
                if(cancelled) {
                    controls.stop();
                } else {
                    scannerControls = controls;
                }
            } catch (error) {
                if(!cancelled) {
                    console.error('Error accessing webcam:', error);
                }
            }
        };
        startWebcam();
        return () => {
            cancelled = true;
            scannerControls?.stop();
            if (webcamStream) {
                webcamStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    
    return (
        <div>
            <h1>Register Page</h1>
            <div>
                <div>製品名: <input type="text" /></div>
                <div>製品番号: <input type="number" /></div>
                <div>賞味期限: <input type="date" /></div>
                <div>保存場所: <input type="text" /></div>
                <div>Scanned Barcode: {barcodeValue}</div>
                <video ref={videoRef} autoPlay muted></video>
            </div>
        </div>
    );
}
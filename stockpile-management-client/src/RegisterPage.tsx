import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';
import { BrowserMultiFormatOneDReader, type IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';
import type { Stockpile } from './stockpiles/stockpile';
import { hasAnyTexts, isNumber } from './texts/hasAnyTexts';
import { db } from './stockpiles/ds';

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
    const lastBarcodeValue = useRef<string | null>(null);
    const [barcodeValue, setBarcodeValue] = useState('');
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        if(saving) {
            return;
        }
        const form = event.currentTarget;
        const data = new FormData(form);
        const stockpile: Stockpile = {
            id: crypto.randomUUID(),
            name: String(data.get('productName')).trim(),
            gtin: String(data.get('gtin')).trim(),
            expiryDate: String(data.get('expiryDate')).trim(),
            location: String(data.get('location')).trim(),
            quantity: Number(data.get('quantity')),
            isSynced: false,
            updatedAt: new Date().toISOString(),
        };
        if(!hasAnyTexts(stockpile.gtin) || !hasAnyTexts(stockpile.expiryDate) || !isNumber(stockpile.quantity)) {
            setMessage('製品番号、期限日、数量を入力してください。');
            return;
        }
        setSaving(true);
        setMessage('保存中...');
        try {
            await db.stockpiles.add(stockpile);
            form.reset();
            lastBarcodeValue.current = null;
            setBarcodeValue('');
            setMessage('保存しました。');
        } catch (error) {
            console.error('Error saving stockpile:', error);
            setMessage('保存中にエラーが発生しました。');
        }finally {
            setSaving(false);
        }
    };
    useEffect(() => {
        const video = videoRef.current;
        if(video == null) {
            return;
        }
        let cancelled = false;
        let webcamStream: MediaStream | null = null;

        const codeReader = new BrowserMultiFormatOneDReader(hints);
        let scannerControls: IScannerControls | null = null;
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
                        if (result && result.getText() !== lastBarcodeValue.current) {
                            setBarcodeValue(result.getText());
                            lastBarcodeValue.current = result.getText();
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
            <form onSubmit={handleSubmit}>
                <div><label>製品名: </label><input name="productName" type="text" /></div>
                <div><label>製品番号: </label><input name="gtin" type="text" 
                    value={barcodeValue} 
                    onChange={(e) => setBarcodeValue(e.target.value)}
                    required />
                </div>
                <div><label>使用期限: </label><input name="expiryDate" type="date" /></div>
                <div><label>保存場所: </label><input name="location" type="text" /></div>
                <div><label>数量: </label><input name="quantity" type="number" min="1" defaultValue={1} /></div>
                <video ref={videoRef} autoPlay muted></video>
                <div><button type="submit" disabled={saving}>登録</button></div>
                {message && <div role="status">{message}</div>}
            </form>
        </div>
    );
}
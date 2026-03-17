import React, { useState } from 'react';
import { extractImages } from '../services/api';

export const ExtractForm: React.FC = () => {
    const [markedImage, setMarkedImage] = useState<File | null>(null);
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [watermark, setWatermark] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!markedImage || !originalImage || !watermark) {
            return alert('Please upload all three images');
        }

        setIsLoading(true);
        try {
            const result = await extractImages(markedImage, originalImage, watermark);
            setResultUrl(result);
        } catch (error) {
            console.error(error);
            alert('Error processing extract request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Extract Watermark</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Marked Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setMarkedImage(e.target.files?.[0] || null)} />
                </div>
                <div>
                    <label>Original Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setOriginalImage(e.target.files?.[0] || null)} />
                </div>
                <div>
                    <label>Watermark Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setWatermark(e.target.files?.[0] || null)} />
                </div>
                <button type="submit" disabled={isLoading || !markedImage || !originalImage || !watermark}>
                    {isLoading ? 'Processing...' : 'Extract'}
                </button>
            </form>

            {resultUrl && (
                <div className="result">
                    <h3>Result:</h3>
                    <img src={resultUrl} alt="Extracted output" />
                </div>
            )}
        </div>
    );
};

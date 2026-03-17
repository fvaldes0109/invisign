import React, { useState } from 'react';
import { engraveImages } from '../services/api';

export const EngraveForm: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [watermark, setWatermark] = useState<File | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !watermark) return alert('Please upload both images');

        setIsLoading(true);
        try {
            const result = await engraveImages(image, watermark);
            setResultUrl(result);
        } catch (error) {
            console.error(error);
            alert('Error processing engrave request');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Engrave Watermark</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Target Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                </div>
                <div>
                    <label>Watermark Image:</label>
                    <input type="file" accept="image/*" onChange={(e) => setWatermark(e.target.files?.[0] || null)} />
                </div>
                <button type="submit" disabled={isLoading || !image || !watermark}>
                    {isLoading ? 'Processing...' : 'Engrave'}
                </button>
            </form>

            {resultUrl && (
                <div className="result">
                    <h3>Result:</h3>
                    <img src={resultUrl} alt="Engraved output" />
                </div>
            )}
        </div>
    );
};

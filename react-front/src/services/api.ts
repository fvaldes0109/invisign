import { API_BASE_URL } from '../config';

export const engraveImages = async (image: File, watermark: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('watermark', watermark);

    const response = await fetch(`${API_BASE_URL}/engrave`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to engrave images');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

export const extractImages = async (markedImage: File, originalImage: File, watermark: File): Promise<string> => {
    const formData = new FormData();
    formData.append('marked_image', markedImage);
    formData.append('original_image', originalImage);
    formData.append('watermark', watermark);

    const response = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to extract images');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
};
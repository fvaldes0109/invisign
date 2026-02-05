import cv2
import numpy as np
import services.masking as masking

def process(marked_image_bytes, original_image_bytes, watermark_bytes):
    # Convert bytes data to numpy array

    nparr_marked_img = np.frombuffer(marked_image_bytes, np.uint8)
    nparr_original_img = np.frombuffer(original_image_bytes, np.uint8)
    nparr_mark = np.frombuffer(watermark_bytes, np.uint8)

    # Decode image
    marked_image = cv2.imdecode(nparr_marked_img, cv2.IMREAD_COLOR)
    original_image = cv2.imdecode(nparr_original_img, cv2.IMREAD_COLOR)
    mark = cv2.imdecode(nparr_mark, cv2.IMREAD_COLOR)

    if marked_image is None or original_image is None or mark is None:
        raise ValueError("Could not decode one or more images.")

    # Call the external masking method
    # This assumes masking.mask_image returns a cv2 image (numpy array)
    result = masking.extract_mask(marked_image, original_image, mark)

    return result
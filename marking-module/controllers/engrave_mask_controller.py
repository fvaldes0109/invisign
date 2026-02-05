import cv2
import numpy as np
import services.masking as masking

def process(image_bytes, watermark_bytes):
    # Convert bytes data to numpy array
    nparr_img = np.frombuffer(image_bytes, np.uint8)
    nparr_mark = np.frombuffer(watermark_bytes, np.uint8)

    # Decode image
    image = cv2.imdecode(nparr_img, cv2.IMREAD_COLOR)
    mark = cv2.imdecode(nparr_mark, cv2.IMREAD_COLOR)

    if image is None or mark is None:
        raise ValueError("Could not decode one or more images.")

    # Call the external masking method
    # This assumes masking.mask_image returns a cv2 image (numpy array)
    result = masking.mask_image(image, mark)

    return result
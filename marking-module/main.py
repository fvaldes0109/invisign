import os
import cv2
from services import masking

IMG_PATH = 'images/image.png'
MARK_PATH = './images/mark.png'

def main():
    if not os.path.exists(IMG_PATH) or not os.path.exists(MARK_PATH):
        print(f"Error: Please ensure {IMG_PATH} and {MARK_PATH} exist.")
        return

    # Load images
    image = cv2.imread(IMG_PATH)
    mark = cv2.imread(MARK_PATH)

    if image is None or mark is None:
        print("Error: Could not read image files.")
        return

    print(f"Image size: {image.shape}")
    print(f"Watermark size: {mark.shape}")

    # Embed Watermark
    print("Embedding watermark...")
    final_image = masking.mask_image(image, mark)

    # Display Reconstructed Image
    # Using a fixed size for display only, to fit on screen
    display_image = cv2.resize(final_image, (800, 800))
    cv2.imshow("Reconstructed Image", display_image)

    # Extract Watermark
    print("Extracting watermark...")
    extracted_watermark, similarity = masking.extract_mask(final_image, image, mark)
    print(f"Similarity (NCC): {similarity:.4f}")

    cv2.imshow("Extracted Watermark", extracted_watermark)

    #save display_image and extracted_watermark
    cv2.imwrite('images/reconstructed_image.png', final_image)
    cv2.imwrite('images/extracted_watermark.png', extracted_watermark)

    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
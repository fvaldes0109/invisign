import os
import cv2
from services import masking

IMG_PATH = './images/image.png'
MARK_PATH = './images/mark.png'

def main():
    if not os.path.exists(IMG_PATH) or not os.path.exists(MARK_PATH):
        print(f"Error: Please ensure {IMG_PATH} and {MARK_PATH} exist.")
        return

    image = cv2.imread(IMG_PATH)
    mark = cv2.imread(MARK_PATH)

    final_image = masking.mask_image(image, mark)

    display_image = cv2.resize(final_image, (800, 800))
    cv2.imshow("Reconstructed Image", display_image)

    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
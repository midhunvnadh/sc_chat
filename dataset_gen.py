import os
import cv2
import numpy as np
from skimage.feature import graycomatrix, graycoprops
from scipy.stats import skew, kurtosis
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import concurrent.futures

source_folder = "dataset"

data = pd.DataFrame(columns=['Image', "Hue Histogram", "Saturation Histogram", "Value Histogram", 'Contrast', 'Dissimilarity', 'Homogeneity', 'Energy',
                    'Correlation', 'Mean', 'Variance', 'Skewness', 'Kurtosis', 'Median', 'Mode', "target"])


def extract_color_histogram(image):
    hsv_image = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    h, s, v = cv2.split(hsv_image)
    hist_h = cv2.calcHist([h], [0], None, [16], [0, 180])
    hist_s = cv2.calcHist([s], [0], None, [16], [0, 256])
    hist_v = cv2.calcHist([v], [0], None, [16], [0, 256])
    hist = np.concatenate((hist_h, hist_s, hist_v)).flatten()
    hist = hist / np.sum(hist)
    return hist


current_d_index = 0
d_index = []


def process_file(file_path):
    if os.path.isfile(file_path):
        image_props = {}
        image = cv2.imread(file_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        if image is not None:
            color_hist = extract_color_histogram(image)
            image_props['Hue Histogram'] = color_hist[:16]
            image_props['Saturation Histogram'] = color_hist[16:32]
            image_props['Value Histogram'] = color_hist[32:]

        image = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
        if image is not None:
            _, thresholded_image = cv2.threshold(
                image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            inverted_image = cv2.bitwise_not(thresholded_image)
            gray_image = (image * 255).astype(np.uint8)
            glcm = graycomatrix(gray_image, [5], [
                                0, np.pi/4, np.pi/2, 3*np.pi/4], levels=256, symmetric=True, normed=True)
            glcm_props = ['contrast', 'dissimilarity',
                          'homogeneity', 'energy', 'correlation']
            glcm_features = [graycoprops(glcm, prop).ravel()[0]
                             for prop in glcm_props]
            mean = np.mean(image)
            variance = np.var(image)
            moments = cv2.moments(image)
            skewness = moments['mu03'] / np.power(variance, 1.5)
            kurt = kurtosis(image.ravel())
            median = np.median(image)
            mode_values = pd.Series(image.flatten()).mode()
            mode = float(mode_values[0]) if len(
                mode_values) > 0 else np.nan

            image_props['Contrast'] = glcm_features[0]
            image_props['Dissimilarity'] = glcm_features[1]
            image_props['Homogeneity'] = glcm_features[2]
            image_props['Energy'] = glcm_features[3]
            image_props['Correlation'] = glcm_features[4]
            image_props['Mean'] = mean
            image_props['Variance'] = variance
            image_props['Skewness'] = skewness
            image_props['Kurtosis'] = kurt
            image_props['Median'] = median
            image_props['Mode'] = mode
            image_props['Image'] = file_path.split("/")[-1]

            folder = file_path.split("/")[-2]

            global current_d_index
            if folder not in d_index:
                d_index.append(folder)
                current_d_index += 1

            image_props['target'] = d_index.index(folder)

            return image_props
    else:
        print(f"Error: {file_path} is not a file")


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = []
        current = 0
        total_files = 0

        for folder in os.listdir(source_folder):
            files = os.listdir(os.path.join(source_folder, folder))
            for file in files:
                file_path = os.path.join(source_folder, folder, file)
                futures.append(executor.submit(process_file, file_path))
                total_files += 1

        for future in concurrent.futures.as_completed(futures):
            image_props = future.result()
            if image_props:
                data.loc[len(data)] = image_props
                current += 1
                print(
                    f"Progress {int((current/total_files)*100)}%", end="\r")

    output_file = "dataset.xlsx"
    data.to_excel(output_file, index=False)

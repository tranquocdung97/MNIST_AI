from keras.models import model_from_json
from cv2 import cv2
import numpy as np


def detect(path_img):
    with open('model/model_architecture.json', 'r') as f:
        model = model_from_json(f.read())

    model.load_weights('model/model_weights.h5')
    load_img = cv2.imread(path_img, 0)
    fix_size_img = cv2.resize(load_img, (28, 28))
    model_img = fix_size_img.reshape(28, 28, 1)/255

    input_model = np.array([model_img])
    results = model.predict(input_model)
    number_predict = np.argmax(results)
    return number_predict

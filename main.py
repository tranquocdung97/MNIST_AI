from flask import Flask, render_template, request, jsonify
from datetime import datetime
from werkzeug.utils import secure_filename
from detect_mnist import detect
import os
from keras import backend as K
import logging
from datetime import datetime
import config
app = Flask(__name__)

UPLOAD_FOLDER = config.UPLOAD_FOLDER
if not os.path.isdir(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
LOGGING_NAME_FOLDER = config.LOGGING_NAME_FOLDER
if not os.path.isdir(LOGGING_NAME_FOLDER):
    os.makedirs(LOGGING_NAME_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    try:
        # logging.INFO("upload start")
        file_upload = request.files['file']
        s_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S_")
        name_file_up = secure_filename(s_time + file_upload.filename)
        url_file = os.path.join(UPLOAD_FOLDER, name_file_up)
        file_upload.save(url_file)
        # logging.INFO("name file up: ", name_file_up)
        result = {"status": "success", "type": "upload",
                  "name_file_up": name_file_up}
        return jsonify(result)
    except:
        # logging.ERROR("upload fail")
        result = {"status": "fail", "type": "upload"}
        return jsonify(result)


@app.route('/predict/<name_file_up>', methods=['GET'])
def predict(name_file_up):
    try:
        url_file = os.path.join(UPLOAD_FOLDER, name_file_up)
        K.clear_session()
        number_predict = detect(url_file)
        K.clear_session()
        result = jsonify({"status": "success", "url_file": url_file,
                          "type": "predict", "result_predict": str(number_predict)})
        return result
    except:
        result = jsonify({"status": "fail", "url_file": url_file,
                          "type": "predict"})
        return result


if __name__ == '__main__':
    app.run(debug=True)

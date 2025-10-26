from flask import Flask, request, jsonify, send_file
from ultralytics import YOLO
import cv2, os, uuid

app = Flask(__name__)
model = YOLO("best.pt")   # your trained model path

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]
    img_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4()}.jpg")
    file.save(img_path)

    # Run YOLO prediction
    results = model.predict(source=img_path, conf=0.25)
    output_img = results[0].plot()

    output_path = os.path.join(OUTPUT_FOLDER, os.path.basename(img_path))
    cv2.imwrite(output_path, output_img)

    return send_file(output_path, mimetype="image/jpeg")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

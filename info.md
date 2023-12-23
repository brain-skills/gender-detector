Для создания детектора пола по лицу через камеру с использованием библиотеки `face-api.js`, вам нужно выполнить несколько шагов. Прежде всего, убедитесь, что вы подключили библиотеку в вашем проекте. Вы можете скачать её [здесь](https://github.com/justadudewhohacks/face-api.js/) или использовать CDN:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/face-api.js"></script>
    <title>Gender Recognition</title>
</head>
<body>
    <video id="video" width="800" height="600" autoplay></video>
    <script>
        // Здесь будет ваш JavaScript код
    </script>
</body>
</html>
```

Затем добавьте следующий код для использования камеры и детекции пола:

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('video');

    // Запускаем видеопоток с камеры
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;

    // Загружаем модели face-api.js
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');
    await faceapi.nets.ageGenderNet.loadFromUri('/models');

    // Детекция лица и определение пола
    video.addEventListener('play', () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video,
                new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors().withFaceExpressions().withAgeAndGender();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

            resizedDetections.forEach(result => {
                const { age, gender, genderProbability } = result;
                new faceapi.draw.DrawTextField(
                    [
                        `${faceapi.round(age, 0)} years`,
                        `${gender} (${faceapi.round(genderProbability)})`
                    ],
                    result.detection.box.bottomLeft
                ).draw(canvas);
            });
        }, 100);
    });
});
```

Обратите внимание, что вы должны разместить модели `face-api.js` (например, tiny_face_detector_model-weights_manifest.json, и так далее) в подпапке `/models`. Вы можете их скачать с [репозитория face-api.js](https://github.com/justadudewhohacks/face-api.js/).
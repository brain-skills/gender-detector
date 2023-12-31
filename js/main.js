document.addEventListener("DOMContentLoaded", () => {
  // Загрузка моделей
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
    faceapi.nets.ageGenderNet.loadFromUri("./models"),
  ]).then(startVideo);

  // Начало работы с видео
  async function startVideo() {
    const video = document.getElementById("video");

    try {
      // Проверяем поддержку старого метода getUserMedia
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      if (!getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser");
      }

      const stream = await new Promise((resolve, reject) => {
        getUserMedia.call(navigator, { video: {} }, resolve, reject);
      });

      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }

      video.addEventListener("loadedmetadata", () => {
        detectGender(video);
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Детекция пола
  async function detectGender(video) {
    const genderResult = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withAgeAndGender();

    if (genderResult) {
      const gender = genderResult.gender;
      const genderLabel = gender === "male" ? "Мужской" : "Женский";

      // Отобразить название пола на странице
      const genderLabelElement = document.getElementById("gender-label");
      genderLabelElement.innerText = `Пол: ${genderLabel}`;
    }

    // Запустить функцию detectGender снова для обнаружения следующего кадра
    requestAnimationFrame(() => detectGender(video));
  }
});
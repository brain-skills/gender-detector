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
      const genderResult = document.getElementById('gender-result');
      if (detections.length > 0) {
        const gender = detections[0].gender;
        const genderText = gender === 'male' ? 'Мужской' : 'Женский';
        genderResult.textContent = `Пол: ${genderText}`;
      } else {
        genderResult.textContent = 'Не удалось определить пол';
      }
    }
});
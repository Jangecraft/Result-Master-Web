import { getRandomInt, getRandomFloat } from "./random.js";

// เมื่อหน้าเว็บโหลดขึ้นมา ให้ปุ่ม Reset มีชื่อว่า "Start"
document.addEventListener("DOMContentLoaded", function () {
  const resetBtn = document.getElementById("reset-btn");
  resetBtn.innerHTML = '<i class="fas fa-random"></i> Start';
});

document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const resultDiv = document.getElementById("result");
  const modeSelect = document.getElementById("mode-select");
  const answerInput = document.getElementById("answer-input");
  const totalQuestionsEl = document.getElementById("total-questions");
  const correctAnswersEl = document.getElementById("correct-answers");
  const incorrectAnswersEl = document.getElementById("incorrect-answers");

  let totalQuestions = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let Answer = 0; // เก็บคำตอบที่ถูกต้อง

  // ตรวจสอบว่าเกมหยุดอยู่หรือไม่
  let stopGame = false;

  resetBtn.addEventListener("click", () => {
    if (!stopGame) {
      resetGame(); // reset คะแนนกลับเป็นค่าเริ่มต้น
    }
    stopGame = false;
    resultDiv.innerHTML = "";
    resetBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reset';
    resetBtn.className = "container-fluid btn btn-secondary btn-lg";
    generateQuestion(); // สุ่มคำถามขึ้นมาใหม่
  });

  function resetGame() {
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    answerInput.value = ""; // รีเซ็ตช่อง Input
    resultDiv.textContent = "???"; // รีเซ็ตหน้าจอผลลัพธ์
    updateScore();
  }

  submitBtn.addEventListener("click", () => {
    if (totalQuestions <= 0) {
      return;
    }

    const userAnswer = answerInput.value.trim();
    if (userAnswer === "") {
      alert("กรุณากรอกคำตอบ");
      return;
    }

    if (isNaN(parseInt(userAnswer))) {
      alert("คำตอบต้องเป็นตัวเลขเท่านั้น");
      return;
    }

    stopGame = true;

    if (Number(userAnswer) === Number(Answer)) {
      correctAnswers++;
      resultDiv.innerHTML += `<br><span class="text-success">ถูกต้อง! คำตอบคือ ${Answer}</span>`;
    } else {
      incorrectAnswers++;
      resultDiv.innerHTML += `<br><span class="text-danger">ผิด! คำตอบที่ถูกต้องคือ ${Answer}</span>`;
    }
    updateScore();

    resetBtn.innerHTML = '<i class="fa-solid fa-forward"></i> Next';
    resetBtn.className = "container-fluid btn btn-warning btn-lg";
    answerInput.value = ""; // รีเซ็ตช่อง Input
  });

  function getAnswer(start, operator, value) {
    if (operator === "=") start = value;
    else if (operator === "+") start += value;
    else if (operator === "+=") start += value;
    else if (operator === "-") start -= value;
    else if (operator === "-=") start -= value;
    else if (operator === "*") start *= value;
    else if (operator === "*=") start *= value;
    else if (operator === "/")
      start = Math.floor(start / value); // หารให้ได้จำนวนเต็ม
    else if (operator === "/=")
      start = Math.floor(start / value); // หารให้ได้จำนวนเต็ม
    else if (operator === "%") start %= value;
    else if (operator === "%=") start %= value;
    else if (operator === "++") start++;
    else if (operator === "--") start--;
    return start;
  }

  function generateComplexity(start, level, mode) {
    const normal_operator = ["=", "+", "-", "*", "/", "%"];
    const extra_operator = [
      ...normal_operator,
      "+=",
      "-=",
      "*=",
      "/=",
      "%=",
      "++",
      "--",
    ];
    let question = "";
    let randomOperator = ""; // กำหนดให้ตัวแปรนี้อยู่ภายนอก

    if (level < 2) {
      level = 2;
    }

    for (let i = 0; i < level; i++) {
      question += "<br>";
      let text = "";
      if (mode === "basic") {
        randomOperator =
          normal_operator[Math.floor(Math.random() * normal_operator.length)];
      } else {
        randomOperator =
          extra_operator[Math.floor(Math.random() * extra_operator.length)];
      }
      let randomValue = getRandomInt(1, 10);

      if (normal_operator.includes(randomOperator)) {
        if (randomOperator === "=") {
          start = getAnswer(start, randomOperator, randomValue);
          text += `A ${randomOperator} ${randomValue};`;
        } else if (randomOperator === "/") {
          if (start % 2 == 0 && start != 0) {
            randomValue = 2;
            start = getAnswer(start, randomOperator, randomValue);
            text += `A = A ${randomOperator} ${randomValue};`;
          } else {
            // เปลี่ยนวิธีคิดเผื่อไม่ให้หารเป็นเศษ
            start = getAnswer(start, "=", randomValue);
            text += `A = ${randomValue};`;
          }
        } else if (randomOperator === "%") {
          randomValue = 2;
          start = getAnswer(start, randomOperator, randomValue);
          text += `A = A ${randomOperator} ${randomValue};`;
        } else {
          start = getAnswer(start, randomOperator, randomValue);
          text += `A = A ${randomOperator} ${randomValue};`;
        }
      } else {
        if (randomOperator === "++" || randomOperator === "--") {
          start = getAnswer(start, randomOperator, 0);
          text += `A${randomOperator};`;
        } else if (randomOperator === "/=") {
          if (start % 2 == 0 && start != 0) {
            randomValue = 2;
            start = getAnswer(start, randomOperator, randomValue);
            text += `A ${randomOperator} ${randomValue};`;
          } else {
            // เปลี่ยนวิธีคิดเผื่อไม่ให้หารเป็นเศษ
            start = getAnswer(start, "=", randomValue);
            text += `A = ${randomValue};`;
          }
        } else if (randomOperator === "%=") {
          randomValue = 2;
          start = getAnswer(start, randomOperator, randomValue);
          text += `A ${randomOperator} ${randomValue};`;
        } else {
          start = getAnswer(start, randomOperator, randomValue);
          text += `A ${randomOperator} ${randomValue};`;
        }
      }

      question += text;
    }
    Answer = start;
    return question;
  }

  function generateQuestion() {
    stopGame = false;
    const mode = modeSelect.value;
    let A = getRandomInt(0, 10);
    let question = `int A = ${A};`;

    if (mode === "basic") {
      question += generateComplexity(A, getRandomInt(1, 2), mode);
    } else if (mode === "intermediate") {
      question += generateComplexity(A, getRandomInt(3, 4), mode);
    } else if (mode === "advanced") {
      question += generateComplexity(A, getRandomInt(5, 6), mode);
    }

    resultDiv.innerHTML = question;
    totalQuestions++;
    updateScore();
  }

  function updateScore() {
    totalQuestionsEl.textContent = `Total: ${totalQuestions}`;
    correctAnswersEl.textContent = `Correct: ${correctAnswers}`;
    incorrectAnswersEl.textContent = `Incorrect: ${incorrectAnswers}`;
    updateProgressBar();
  }

  function updateProgressBar() {
    totalQuestions--;
    const correctPercentage =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const incorrectPercentage =
      totalQuestions > 0 ? (incorrectAnswers / totalQuestions) * 100 : 0;

    const correctProgressBar = document.getElementById("correct-progress-bar");
    const incorrectProgressBar = document.getElementById(
      "incorrect-progress-bar"
    );

    correctProgressBar.style.width = `${correctPercentage}%`;
    correctProgressBar.setAttribute("aria-valuenow", correctPercentage);
    correctProgressBar.textContent = `${Math.round(correctPercentage)}%`;

    incorrectProgressBar.style.width = `${incorrectPercentage}%`;
    incorrectProgressBar.setAttribute("aria-valuenow", incorrectPercentage);
    incorrectProgressBar.textContent = `${Math.round(incorrectPercentage)}%`;
    totalQuestions++;
  }

  function changeModeSelect() {
    resetGame();
    generateQuestion();
  }

  modeSelect.addEventListener("change", changeModeSelect);
});

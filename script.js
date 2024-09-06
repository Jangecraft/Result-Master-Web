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
    if (!stopGame){
      // reset คะแนนกลับเป็นค่าเริ่มต้น
      resetGame();
    }
    // เปลี่ยนชื่อปุ่มคืนเป็น Reset
    resetBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reset';
    resetBtn.className = "container-fluid btn btn-secondary btn-lg";
    // สุ่มคำถามขึ้นมาใหม่
    generateQuestion();
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
      return
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

    if (userAnswer === Answer) {
      correctAnswers++;
      resultDiv.innerHTML += `<br><span class="text-success">ถูกต้อง! คำตอบคือ ${Answer}</span>`;
    } else {
      incorrectAnswers++;
      resultDiv.innerHTML += `<br><span class="text-danger">ผิด! คำตอบที่ถูกต้องคือ ${Answer}</span>`;
    }
    updateScore();

    // เปลี่ยนชื่อปุ่มเป็นปุ่ม Next ชั่วคราว
    resetBtn.innerHTML = '<i class="fa-solid fa-forward"></i> Next';
    resetBtn.className = "container-fluid btn btn-warning btn-lg";

    answerInput.value = ""; // รีเซ็ตช่อง Input
  });

  // ฟังก์ชันใส่สีให้กับวงเล็บ
  function colorizeBrackets(expression) {
    const colors = ["red", "blue", "green", "purple"];
    let colorIndex = 0;
    let depth = 0;

    return expression.replace(/[()]/g, (bracket) => {
      if (bracket === "(") {
        depth++;
        colorIndex = (depth - 1) % colors.length;
        return `<span style="color: ${colors[colorIndex]}">${bracket}</span>`;
      } else if (bracket === ")") {
        const coloredBracket = `<span style="color: ${colors[(depth - 1) % colors.length]}">${bracket}</span>`;
        depth--;
        return coloredBracket;
      }
    });
  }

  function generateQuestion() {
    stopGame = false;
    const mode = modeSelect.value;
    let question = "";

    if (mode === "basic") {
      question = "int A = 70;<br>A = 60;<br>A เป็นเท่าไหร่?";
      Answer = 60;
    } else if (mode === "intermediate") {
      question = "int B = 10;<br>B += 5;<br>B เป็นเท่าไหร่?";
      Answer = 15;
    } else if (mode === "advanced") {
      question = "int C = 20;<br>C = (C > 10) ? 30 : 40;<br>C เป็นเท่าไหร่?";
      Answer = 30;
    }

    resultDiv.innerHTML = colorizeBrackets(question);
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
});

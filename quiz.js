let quiz = [];
let currentQuestion = 0;
let score = 0;

const quizGameEl = document.getElementById("quiz-game");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const questionCounterEl = document.getElementById("question-counter");
const replayBtn = document.createElement("button");
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");

startBtn.onclick = () => {
    startScreen.style.display = "none"; // ẩn bảng mở đầu
    startQuiz(); // bắt đầu quiz chính
};
// Bắt đầu quiz khi trang load
window.onload = function() {
    startQuiz();
};

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    scoreEl.textContent = `Điểm: ${score}`;
    quizGameEl.style.display = "block";

    // Load lv1, lv2, lv3
    Promise.all([
        fetch('questions-lv1.json').then(res => res.json()),
        fetch('questions-lv2.json').then(res => res.json()),
        fetch('questions-lv3.json').then(res => res.json())
    ])
    .then(([lv1Data, lv2Data, lv3Data]) => {
        // Lấy 10 câu từ mỗi level
        const lv1Questions = shuffleArray(lv1Data).slice(0, 10).map(q => ({ ...q, level: 1 }));
        const lv2Questions = shuffleArray(lv2Data).slice(0, 10).map(q => ({ ...q, level: 2 }));
        const lv3Questions = shuffleArray(lv3Data).slice(0, 10).map(q => ({ ...q, level: 3 }));
        const combined = lv1Questions.concat(lv2Questions, lv3Questions);
        // Xáo trộn toàn bộ
        quiz = shuffleArray(combined).map(q => shuffleAnswers(q));
        showQuestion();
    })
    .catch(err => {
        console.log(err);
        questionEl.textContent = "Không thể tải câu hỏi.";
        answersEl.innerHTML = "";
    });
}
// Xáo trộn mảng
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
// Xáo trộn đáp án của 1 câu
function shuffleAnswers(question) {
    const answers = question.answers.slice();
    const correctAnswer = answers[question.correct];
    const shuffled = shuffleArray(answers);
    const newCorrect = shuffled.indexOf(correctAnswer);
    return {
        question: question.question,
        answers: shuffled,
        correct: newCorrect
    };
}
// Hiển thị câu hỏi
function showQuestion() {
    if (currentQuestion < quiz.length) {
        const q = quiz[currentQuestion];
        questionEl.textContent = q.question;
        answersEl.innerHTML = ""; // Xoá các nút cũ

        // Cập nhật level
        const currentLevel = Math.floor(currentQuestion / 10) + 1;
        levelEl.textContent = `${currentLevel}/3`;

        // Cập nhật question counter
        questionCounterEl.textContent = `${currentQuestion + 1}/${quiz.length}`;

        // Tạo nút trả lời
        q.answers.forEach((ans, i) => {
            const btn = document.createElement("button");
            btn.textContent = ans;
            btn.onclick = () => checkAnswer(i);
            answersEl.appendChild(btn);
        });

        // Hiệu ứng fade in
        setTimeout(() => {
            questionEl.classList.remove('fade-out');
            questionEl.classList.add('fade-in');
            answersEl.classList.remove('fade-out');
            answersEl.classList.add('fade-in');
        }, 50);
    } else {
    questionEl.textContent = "🎉 Quiz kết thúc!";
    answersEl.style.display = "none";
    scoreEl.textContent = `Tổng điểm: ${score}`;
    levelEl.textContent = "3/3";
    questionCounterEl.textContent = `${quiz.length}/${quiz.length}`;

    // tạo nút chơi lại mới mỗi lần
    const replayBtn = document.createElement("button");
    replayBtn.id = "replay-btn";
    replayBtn.textContent = "🔄 Chơi lại";
    replayBtn.onclick = () => {
        replayBtn.remove();            
        startQuiz();                   
    };
    answersEl.parentElement.appendChild(replayBtn);
  }
}
// Kiểm tra đáp án
function checkAnswer(index) {
    const buttons = answersEl.querySelectorAll('button');
    const clickedBtn = buttons[index];

    // Thêm class đúng/sai và vô hiệu hóa tất cả nút
    if (index === quiz[currentQuestion].correct) {
        clickedBtn.classList.add('correct');
        const points = quiz[currentQuestion].level === 1 ? 10 : quiz[currentQuestion].level === 2 ? 20 : 30;
        score += points;
    } else {
        clickedBtn.classList.add('wrong');
    }
    buttons.forEach(btn => btn.classList.add('disabled'));

    scoreEl.textContent = `Điểm: ${score}`;

    // Delay 1 giây rồi chuyển câu
    setTimeout(() => {
        const nextQuestion = currentQuestion + 1;
        const currentLevel = Math.floor(currentQuestion / 10) + 1;
        const nextLevel = Math.floor(nextQuestion / 10) + 1;

        // Nếu sắp chuyển level, show popup
        if (nextLevel > currentLevel) {
            showLevelUp(nextLevel, () => {
                currentQuestion++;
                showQuestion();
            });
        } else {
            currentQuestion++;
            showQuestion();
        }
    }, 1000);
}
function showLevelUp(level, callback) {
    const popup = document.createElement("div");
    popup.textContent = `✨ Level ${level}! ✨`;
    popup.style.position = "absolute";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.padding = "20px 40px";
    popup.style.background = "rgba(255, 255, 255, 0.15)";
    popup.style.color = "#fff";
    popup.style.fontSize = "1.5em";
    popup.style.borderRadius = "15px";
    popup.style.textAlign = "center";
    popup.style.backdropFilter = "blur(8px)";
    popup.style.boxShadow = "0 8px 32px rgba(0,0,0,0.37)";
    popup.style.zIndex = "100";
    popup.style.opacity = "0";
    popup.style.transition = "all 0.5s ease";

    document.body.appendChild(popup);

    // Hiệu ứng fade in
    setTimeout(() => { popup.style.opacity = "1"; }, 50);

    // 2 giây sau fade out và callback
    setTimeout(() => {
        popup.style.opacity = "0";
        setTimeout(() => {
            popup.remove();
            callback();
        }, 500);
    }, 2000);
}

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
    // Reset fade classes
    quizGameEl.classList.remove('fade-out', 'fade-in');

    // Load lv1, lv2, lv3
    Promise.all([
        fetch('questions-lv1.json').then(res => res.json()),
        fetch('questions-lv2.json').then(res => res.json()),
        fetch('questions-lv3.json').then(res => res.json())
    ])
    .then(([lv1Data, lv2Data, lv3Data]) => {

        // Trộn trong từng level thôi
        const lv1Questions = shuffleArray(lv1Data).slice(0, 10).map(q => ({ ...q, level: 1 }));
        const lv2Questions = shuffleArray(lv2Data).slice(0, 10).map(q => ({ ...q, level: 2 }));
        const lv3Questions = shuffleArray(lv3Data).slice(0, 10).map(q => ({ ...q, level: 3 }));

        // KHÔNG xáo trộn tổng thể nữa
        const combined = [
            ...lv1Questions.map(q => shuffleAnswers(q)),
            ...lv2Questions.map(q => shuffleAnswers(q)),
            ...lv3Questions.map(q => shuffleAnswers(q))
        ];

        quiz = combined;
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
        const levelNames = ["Dễ", "Trung bình", "Khó"];
        levelEl.textContent = levelNames[currentLevel - 1];

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
    levelEl.textContent = "Khó";
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

        // Nếu sắp chuyển level và chưa hết game, show popup
        if (nextLevel > currentLevel && nextQuestion < quiz.length) {
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
    // Fade out quiz container
    quizGameEl.classList.add('fade-out');

    // Tạo overlay mờ
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.7)";
    overlay.style.backdropFilter = "blur(8px)";
    overlay.style.zIndex = "999";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.5s ease";
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = "1";

        const popup = document.createElement("div");
        popup.textContent = `🚀 Độ khó tăng lên Level ${level}! 🚀`;
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.padding = "30px 50px";
        popup.style.background = "rgba(255, 255, 255, 0.2)";
        popup.style.color = "#fff";
        popup.style.fontSize = "1.8em";
        popup.style.borderRadius = "20px";
        popup.style.textAlign = "center";
        popup.style.backdropFilter = "blur(10px)";
        popup.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";
        popup.style.zIndex = "1000";
        popup.style.opacity = "0";
        popup.style.transition = "all 0.5s ease";

        document.body.appendChild(popup);

        // Hiệu ứng fade in
        setTimeout(() => { popup.style.opacity = "1"; }, 100);

        // 2.5 giây sau fade out và callback
        setTimeout(() => {
            popup.style.opacity = "0";
            overlay.style.opacity = "0";
            setTimeout(() => {
                popup.remove();
                overlay.remove();
                // Fade back in quiz container
                quizGameEl.classList.remove('fade-out');
                quizGameEl.classList.add('fade-in');
                callback();
            }, 500);
        }, 2500);
    }, 500); // Delay to allow fade out
                                                                          }

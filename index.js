
// Mở Minecraft========================================================================
document.getElementById("playBtn").addEventListener("click", () => {
  const ip = document.getElementById("server-ip").textContent;
  const port = document.getElementById("server-port").textContent;

  // Tạo popup nếu chưa có
  let popup = document.getElementById("countdownPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "countdownPopup";
    popup.innerHTML = `
      <div class="popup-box">
        <h2>⏳ Đang chuẩn bị...</h2>
        <p id="countText">Vào game sau <span id="countdown">5</span>s</p>
        <p class="note">💬 Đợi 5 giây, tôi sẽ nhập IP, port cho bạn!</p>
        <button id="cancelBtn">❌ Hủy</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Style trực tiếp bằng JS
    const style = document.createElement("style");
    style.textContent = `
      #countdownPopup {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease;
        z-index: 999;
      }
      #countdownPopup.active {
        opacity: 1;
        pointer-events: auto;
      }
      .popup-box {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        padding: 30px 50px;
        color: #fff;
        text-align: center;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 0 25px rgba(0,0,0,0.5);
        transform: translateY(40px);
        opacity: 0;
        transition: all 0.4s ease;
      }
      #countdownPopup.active .popup-box {
        transform: translateY(0);
        opacity: 1;
      }
      .popup-box h2 {
        font-size: 24px;
        margin-bottom: 10px;
      }
      .popup-box .note {
        font-size: 14px;
        opacity: 0.8;
        margin-top: 10px;
      }
      #cancelBtn {
        margin-top: 15px;
        background: rgba(255, 80, 80, 0.8);
        color: #fff;
        border: none;
        border-radius: 10px;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
      }
      #cancelBtn:hover {
        background: rgba(255, 50, 50, 1);
        transform: scale(1.05);
      }
      #cancelBtn:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);
  }

  // Hiện popup và đếm ngược
  popup.classList.add("active");
  const countdownEl = popup.querySelector("#countdown");
  const cancelBtn = popup.querySelector("#cancelBtn");
  let time = 5;
  let cancelled = false;
  countdownEl.textContent = time;

  const interval = setInterval(() => {
    if (cancelled) {
      clearInterval(interval);
      popup.classList.remove("active");
      return;
    }
    time--;
    countdownEl.textContent = time;
    if (time <= 0) {
      clearInterval(interval);
      popup.classList.remove("active");
      if (!cancelled) {
        setTimeout(() => {
          window.location.href = `minecraft://?addExternalServer=VanhLoreVanhLore|${ip}:${port}`;
        }, 400);
      }
    }
  }, 1000);

  // Nút Hủy
  cancelBtn.addEventListener("click", () => {
    cancelled = true;
    popup.classList.remove("active");
  });
});

// Nút bấm sao chép IP=================================================================
document.getElementById("copyBtn").addEventListener("click", function() {
  const ip = "play.tenmiencuaserver.vn"; // ⚡ Thay IP server của anh vào đây
  navigator.clipboard.writeText(ip);

  // Nếu popup chưa tồn tại thì tạo
  let copiedPopup = document.getElementById("copiedPopup");
  if (!copiedPopup) {
    copiedPopup = document.createElement("div");
    copiedPopup.id = "copiedPopup";
    copiedPopup.innerHTML = `
      <div class="copied-box">
        <span class="tick">✅</span> <span>Đã sao chép IP!</span>
      </div>
    `;
    document.body.appendChild(copiedPopup);

    // Style trực tiếp
    const style = document.createElement("style");
    style.textContent = `
      #copiedPopup {
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%) translateY(50px);
        opacity: 0;
        transition: all 0.4s ease;
        z-index: 9999;
        pointer-events: none;
      }
      #copiedPopup.active {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      .copied-box {
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px;
        color: #aaf0c4;
        font-weight: 600;
        padding: 10px 20px;
        font-size: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 8px;
        animation: glow 1.5s ease-in-out infinite alternate;
      }
      @keyframes glow {
        from { text-shadow: 0 0 5px #00ffb3, 0 0 10px #00ffb3; }
        to { text-shadow: 0 0 15px #00ffb3, 0 0 25px #00ffb3; }
      }
      .tick {
        font-size: 20px;
      }
    `;
    document.head.appendChild(style);
  }

  // Hiệu ứng xuất hiện và biến mất
  copiedPopup.classList.add("active");
  setTimeout(() => {
    copiedPopup.classList.remove("active");
  }, 2000);

//reddot tình trạng server=================================================================
// Giả lập kiểm tra server (anh có thể thay bằng API thật sau)
const serverStatusBox = document.querySelector(".server-status");
const serverStatusText = document.getElementById("server-status-text");

// Giả lập: 50% online - 50% offline
setTimeout(() => {
  const isOnline = Math.random() > 0.5;
  if (isOnline) {
    serverStatusBox.classList.add("online");
    serverStatusText.textContent = "Server đang mở";
  } else {
    serverStatusBox.classList.add("offline");
    serverStatusText.textContent = "Server đang offline";
  }
}, 1000);

});
// phần thông báo trang chủ===============================================================================================
function showPopup() {
  // Tạo overlay
  const overlay = document.createElement('div');
  overlay.style = `
    position:fixed;inset:0;
    background:rgba(0,0,0,0.4);
    backdrop-filter:blur(5px);
    display:flex;justify-content:center;align-items:center;
    z-index:9999;
    animation:fadeIn 0.4s ease;
  `;

  // Tạo popup
  const popup = document.createElement('div');
  popup.style = `
    background:rgba(255,255,255,0.15);
    backdrop-filter:blur(20px);
    border:1px solid rgba(255,255,255,0.25);
    border-radius:16px;
    padding:22px 28px;
    text-align:center;
    color:white;
    width:85%;
    max-width:340px;
    box-shadow:0 0 25px rgba(0,0,0,0.2);
    transform:scale(0.8);
    opacity:0;
    animation:popIn 0.4s ease forwards;
  `;
  popup.innerHTML = `
    <h2 style="margin:0 0 10px;font-size:1.3em;">Người trẻ tuổi thân mến!</h2>
    <p style="margin:0 0 15px;font-size:0.95em;">Đã cập nhập phiên bản Minecraft mới!<br>
    - Minecraft 1.21.124<br>
    Các tính năng mới sẽ được thêm...!</p>
    <button style="
      padding:8px 16px;
      border:none;
      border-radius:8px;
      background:rgba(255,255,255,0.3);
      color:white;
      font-weight:600;
      cursor:pointer;
      transition:0.25s;
    ">Đóng thông báo</button>
  `;

  popup.querySelector('button').onclick = () => {
    popup.style.animation = 'popOut 0.3s ease forwards';
    overlay.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Tạo style động cho animation
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }
    @keyframes fadeOut { from {opacity:1;} to {opacity:0;} }
    @keyframes popIn {
      0% {transform:scale(0.8) translateY(20px);opacity:0;}
      100% {transform:scale(1) translateY(0);opacity:1;}
    }
    @keyframes popOut {
      0% {transform:scale(1) translateY(0);opacity:1;}
      100% {transform:scale(0.8) translateY(20px);opacity:0;}
    }
  `;
  document.head.appendChild(style);
}














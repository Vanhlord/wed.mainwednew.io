// Danh sách thẻ có thể dùng
const TAGS = {
    best: "Tốt nhất",
    normal: "Bình thường",
    pending: "Đang đánh giá"
};
// Logo mặc định trong dự án
const DEFAULT_LOGO = "images/app/default.png";
// Danh sách nút (chỉ cần chỉnh ở đây)
const links = [
    {
        name: "Mediafire",
        link: "https://www.mediafire.com/",
        logo: "https://www.mediafire.com/favicon.ico",
        tags: ["best"]
    },
    {
        name: "Tải video tik tok không logo",
        link: "https://snaptik.vn/",
        logo: "https://snaptik.vn/favicon.ico",
        tags: ["best"]
    },
    {
        name: "Cắt nhạc MP3",
        link: "https://mp3cut.net/vi/",
        logo: "",
        tags: ["best"]
    }
];

// Render nút
function renderLinks() {
    const list = document.getElementById("link-list");
    list.innerHTML = "";

    links.forEach(item => {
        const btn = document.createElement("div");
        btn.className = "link-button";
        btn.onclick = () => window.open(item.link, "_blank");
            const logoURL = item.logo && item.logo.trim() !== "" 
            ? item.logo 
            : DEFAULT_LOGO;

        btn.innerHTML = `
            <div class="logo" style="background-image: url('${logoURL}')"></div>
            <div class="info">
                <div class="name">${item.name}</div>
                <div class="tags">
                    ${item.tags.map(t => `<span class="tag">${TAGS[t] || t}</span>`).join("")}
                </div>
            </div>
        `;

        list.appendChild(btn);
    });
}

renderLinks();

function goHome() {
    window.location.href = "menu.html"; 
    // hoặc đổi thành trang chủ anh muốn
}

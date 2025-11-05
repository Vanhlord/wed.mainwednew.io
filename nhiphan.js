// ------------------- NHỊ PHÂN -------------------
const input = document.getElementById('inputText');
const output = document.getElementById('output');

function textToBinary(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes)
    .map(b => b.toString(2).padStart(8, '0'))
    .join(' ');
}

function binaryToText(binary) {
  const bytes = binary.split(' ').map(b => parseInt(b, 2));
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

document.getElementById('convertToBinary').addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return output.innerText = '⚠️ Nhập chữ vô đi nè!';
  output.innerText = textToBinary(text);
});

document.getElementById('convertToText').addEventListener('click', () => {
  const binary = input.value.trim();
  if (!binary) return output.innerText = '⚠️ Nhập mã nhị phân vô đi nha!';
  try {
    output.innerText = binaryToText(binary);
  } catch {
    output.innerText = '❌ Sai định dạng nhị phân rồi á!';
  }
});

// ------------------- MORSE -------------------
const morseInput = document.getElementById('morseInput');
const morseOutput = document.getElementById('morseOutput');

const morseCode = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
  'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
  'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
  'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
  'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--',
  '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.',
  ' ': '/'
};

// 🔤 Hàm loại bỏ dấu tiếng Việt trước khi đổi Morse
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu thanh
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

const textToMorse = (text) => {
  const cleanText = removeVietnameseTones(text.toUpperCase());
  return cleanText.split('').map(ch => morseCode[ch] || '').join(' ');
};

const morseToText = (morse) => {
  const reverseMap = Object.fromEntries(Object.entries(morseCode).map(([k, v]) => [v, k]));
  return morse.trim().split(' ').map(code => reverseMap[code] || '').join('');
};

document.getElementById('textToMorse').addEventListener('click', () => {
  const text = morseInput.value.trim();
  if (!text) return morseOutput.innerText = '⚠️ Nhập chữ vô đi nè!';
  morseOutput.innerText = textToMorse(text);
});

document.getElementById('morseToText').addEventListener('click', () => {
  const code = morseInput.value.trim();
  if (!code) return morseOutput.innerText = '⚠️ Nhập mã Morse vô đi nha!';
  morseOutput.innerText = morseToText(code);
});
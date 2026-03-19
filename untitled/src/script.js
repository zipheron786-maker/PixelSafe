// Функция, которая запускает всё заново
function init() {
  const upload = document.getElementById('upload');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const status = document.getElementById('status');

  if (!upload) return; // Если кнопки нет, выходим

  upload.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        status.innerText = "✅ Картинка готова!";
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };
  
  // Привязываем кнопки "Спрятать" и "Достать"
  document.getElementById('hideBtn').onclick = () => {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imgData.data;
    let text = document.getElementById('secretText').value;
    let bin = "";
    for (let i=0; i<text.length; i++) bin += text[i].charCodeAt(0).toString(2).padStart(16,'0');
    bin += "0000000000000000";
    for (let i=0; i<bin.length; i++) pixels[i*4] = (pixels[i*4] & 0xFE) | parseInt(bin[i]);
    ctx.putImageData(imgData, 0, 0);
    alert("🔒 Зашифровано!");
  };

  document.getElementById('readBtn').onclick = () => {
    let pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let bin = "", res = "";
    for (let i=0; i<pixels.length/4; i++) {
      bin += (pixels[i*4] & 1);
      if (bin.length % 16 === 0) {
        let chunk = bin.slice(-16);
        if (chunk === "0000000000000000") break;
        res += String.fromCharCode(parseInt(chunk, 2));
      }
    }
    alert("🔓 Секрет: " + res);
  };

  document.getElementById('downloadBtn').onclick = () => {
    const a = document.createElement('a');
    a.download = 'pixel_safe_result.png';
    a.href = canvas.toDataURL();
    a.click();
  };
}

// Запускаем магию
init();
// И еще раз на всякий случай через секунду
setTimeout(init, 1000);
// 🔥 GANTI dengan URL Cloudflare kamu
const API_URL = "https://proxy-mile-toe-penn.trycloudflare.com";

let jobId = null;
let interval = null;

async function startClip() {
  const urlInput = document.getElementById("urlInput");
  const status = document.getElementById("status");
  const bar = document.getElementById("progressBar");
  const downloadBtn = document.getElementById("downloadBtn");

  const url = urlInput.value.trim();

  if (!url) {
    alert("Masukkan URL YouTube!");
    return;
  }

  // Reset UI
  status.innerText = "⏳ Mengirim request ke server...";
  bar.style.width = "0%";
  downloadBtn.classList.add("hidden");

  try {
    const res = await fetch(API_URL + "/clip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    if (!res.ok) {
      throw new Error("Server error: " + res.status);
    }

    const data = await res.json();

    if (data.error) {
      status.innerText = "❌ Error: " + data.error;
      return;
    }

    jobId = data.job_id;
    status.innerText = "⚙️ Processing video...";
    startProgressPolling();

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Tidak bisa terhubung ke server.";
  }
}

function startProgressPolling() {
  const status = document.getElementById("status");
  const bar = document.getElementById("progressBar");
  const downloadBtn = document.getElementById("downloadBtn");

  if (interval) clearInterval(interval);

  interval = setInterval(async () => {
    try {
      const res = await fetch(API_URL + "/progress/" + jobId);

      if (!res.ok) {
        throw new Error("Progress error: " + res.status);
      }

      const data = await res.json();
      const progress = data.progress ?? 0;

      bar.style.width = progress + "%";
      status.innerText = "Progress: " + progress + "%";

      if (progress >= 100) {
        clearInterval(interval);
        status.innerText = "✅ Selesai! Video siap di-download.";
        downloadBtn.classList.remove("hidden");
      }

    } catch (err) {
      console.error(err);
      status.innerText = "⚠️ Menunggu respon server...";
    }
  }, 2000);
}

function downloadVideo() {
  if (!jobId) {
    alert("Belum ada video yang diproses!");
    return;
  }

  // buka endpoint download
  window.open(API_URL + "/download/" + jobId, "_blank");
}

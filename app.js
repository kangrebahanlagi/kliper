const API = "https://trails-msgstr-known-implications.trycloudflare.com"; // GANTI!

let jobId = null;

async function startClip() {
  const url = document.getElementById("url").value;
  const status = document.getElementById("status");
  const bar = document.getElementById("bar");
  const download = document.getElementById("download");

  status.innerText = "Mengirim request...";
  bar.style.width = "0%";
  download.classList.add("hidden");

  const res = await fetch(API + "/clip", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({url})
  });

  const data = await res.json();
  jobId = data.job_id;

  status.innerText = "Processing...";
  checkProgress();
}

async function checkProgress() {
  const status = document.getElementById("status");
  const bar = document.getElementById("bar");
  const download = document.getElementById("download");

  const res = await fetch(API + "/progress/" + jobId);
  const data = await res.json();

  bar.style.width = data.progress + "%";

  if (data.progress < 100) {
    setTimeout(checkProgress, 2000);
  } else {
    status.innerText = "Selesai!";
    const result = await fetch(API + "/result/" + jobId);
    const r = await result.json();

    download.href = API + "/" + r.path;
    download.classList.remove("hidden");
  }
}
const form = document.querySelector("form");
const scrapeBtn = document.querySelector("button[type='submit']");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  scrapeBtn.disabled = true; // блокируем кнопку

  try {
    const result = await scrape();
    const blob = new Blob([JSON.stringify(result)], {
      type: "text/plain;charset=utf-8",
    });
    const urlObject = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = urlObject;
    link.download = "result.txt";
    document.body.appendChild(link);
    link.click();

    // Ожидание перед удалением ссылки
    await new Promise((resolve) => setTimeout(resolve, 100));

    document.body.removeChild(link);
  } catch (error) {
    console.error(error);
    alert("An error occurred");
  } finally {
    scrapeBtn.disabled = false; // разблокируем кнопку
  }
});

async function scrape() {
  const url = document.querySelector("#url").value;
  const count = document.querySelector("#count").value;

  await new Promise((resolve) => setTimeout(resolve, 1000)); // добавляем задержку

  const response = await axios.get(
    `/scrape?url=${encodeURIComponent(url)}&count=${count}`
  );

  return response.data;
}

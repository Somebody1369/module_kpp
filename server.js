const express = require("express");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "/")));

app.get("/scrape", async (req, res) => {
  try {
    const url = decodeURIComponent(req.query.url); // декодируем URL
    const count = parseInt(req.query.count);

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Находим элементы с информацией о товарах
    const products = $("div.s-item__info");

    // Создаем пустой массив для хранения результатов парсинга
    const results = [];

    // Парсим информацию о каждом товаре
    products.slice(0, count).each(function () {
      const title = $(this).find("h3.s-item__title").text().trim();
      const price = $(this).find("span.s-item__price").text().trim();
      const link = $(this).find("a.s-item__link").attr("href");

      // Добавляем результаты парсинга в массив
      results.push({ title, price, link });
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

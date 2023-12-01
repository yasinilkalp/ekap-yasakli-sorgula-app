require("dotenv").config();
const playwright = require("playwright");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

app.get("/yasakSorgula", async (req, res) => {
  const { firmaAd } = req.query;
  const imageUrl = "uploads/" + uuidv4() + ".png";
  await yasakliSorgula(firmaAd, imageUrl);
  res.send({
    firmaAd: firmaAd,
    imageUrl: imageUrl,
  });
});

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});

const yasakliSorgula = async (firmaAd, imageUrl) => {
  const browser = await playwright.chromium.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.goto("https://ekap.kik.gov.tr/EKAP/Yasaklilik/YasakliSorgu.aspx");

  let yasaklananInput = page.locator(
    "#ctl00_ContentPlaceHolder1_TextBoxYasaklanan"
  );
  await yasaklananInput.fill(firmaAd);

  await page.click("a#ctl00_ContentPlaceHolder1_btnAra");

  await page.screenshot({ path: imageUrl, fullPage: true });

  await page.close();
  await browser.close();
};

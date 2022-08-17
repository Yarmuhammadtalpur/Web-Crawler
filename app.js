require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const rawdata = fs.readFileSync("data.json");
const data = JSON.parse(rawdata);
const { v4: uuidv4 } = require("uuid");
const { response } = require("express");

//middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
let url;
app.get("/", (req, res) => {
  res.render("search");

  const newData = {
    webUrl: "none",
    WebTitle: "none",
    a: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    p: [],
    li: [],
    button: [],
    images: [],
  };

  fs.writeFileSync("data.json", JSON.stringify(newData), (err) => {
    if (err) throw err;
    console.log("writing done");
  });
});

app.post("/", async (req, res) => {
  let aLinks = [{ title: "", href: "" }];
  let h1 = [];
  let h2 = [];
  let h3 = [];
  let h4 = [];
  let h5 = [];
  let h6 = [];
  let p = [];
  let li = [];
  let td = [];
  let button = [];
  let img = [
    {
      title: "",
      src: "",
      fullSrc: "",
    },
  ];

  url = req.body.url_link;
  let html;
  await axios(url).then((response) => {
    html = response.data;
  });
  const $ = cheerio.load(html);

  $("a").each(function (i, link) {
    const alink = { title: "", href: "" };
    alink.title = $(link).text();
    alink.href = $(link).attr("href");
    aLinks.push(alink);
  });
  $("h1").each(function (i, props) {
    h2.push($(props).text());
  });
  $("h2").each(function (i, props) {
    h2.push($(props).text());
  });
  $("h3").each(function (i, props) {
    h3.push($(props).text());
  });
  $("h4").each(function (i, props) {
    h4.push($(props).text());
  });
  $("h5").each(function (i, props) {
    h5.push($(props).text());
  });
  $("h6").each(function (i, props) {
    h6.push($(props).text());
  });
  $("p").each(function (i, props) {
    p.push($(props).text());
  });
  $("button").each(function (i, props) {
    button.push($(props).text());
  });
  $("img").each(function (i, props) {
    const imgLink = { title: "", src: "", fullSrc: "" };
    imgLink.title = $(props).attr("alt");
    imgLink.src = $(props).attr("src");
    var splitted = url.split(".com");
    imgLink.fullSrc = splitted[0] + ".com/" + $(props).attr("src");

    img.push(imgLink);
  });
  $("li").each(function (i, props) {
    li.push($(props).text());
  });
  $("td").each(function (i, props) {
    td.push($(props).text());
  });
  const newData = {
    webUrl: url,
    WebTitle: $("title").text(),
    a: aLinks,
    h1: h1,
    h2: h2,
    h3: h3,
    h4: h4,
    h5: h5,
    h6: h6,
    p: p,
    li: li,
    button: button,
    images: img,
  };

  fs.writeFileSync("data.json", JSON.stringify(newData), (err) => {
    if (err) throw err;
    console.log("writing done");
  });
  res.redirect("/done");
});

app.get("/done", (req, res) => {
  console.log(url);
  res.render("done", { url });
});

//next path
app.get("/result", (req, res) => {
  res.render("result", { data });
});

app.listen(port, () => {
  console.log("server started");
});

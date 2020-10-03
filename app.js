require("dotenv").config();
const path = require("path");

global.appRoot = path.resolve(__dirname);

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sendMail } = require("./mailer");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/sample", async (req, res) => {
  try {
    const data = await sendMail({
      template: "sample",
      subject: "Sample email",
      context: { title: "Sample email" },
    });
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.post("/book", async (req, res) => {
  try {
    const data = await sendMail({
      template: "book",
      subject: "New Photoshoot Booking",
      context: {
        title: "New Photoshoot Booking",
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        date: req.body.date,
        service: req.body.service,
        message: req.body.message,
      },
    });
    res.json({ data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, (_) => console.log(`App started on port ${port}`));

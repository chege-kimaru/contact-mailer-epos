require("dotenv").config();
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.use(
  "compile",
  hbs({
    viewEngine: {
      viewPath: path.join(process.cwd(), "emails"),
      layoutsDir: `${appRoot}/emails/layouts`,
      partialsDir: `${appRoot}/emails/partials`,
      defaultLayout: `main`,
      helpers: {
        section: function (name, options) {
          if (!this._sections) this._sections = {};
          this._sections[name] = options.fn(this);
          return null;
        },
      },
      extname: ".hbs",
    },
    viewPath: path.join(appRoot, "emails"),
    extName: ".hbs",
  })
);

/**
 * @param emailOptions {{from: string, to: string, subject:string, template: string, context: object}}
 * @returns {Promise<void>}
 */
exports.sendMail = async (emailOptions) => {
  emailOptions.from = emailOptions.from || process.env.EMAIL_FROM;
  emailOptions.to = emailOptions.to || process.env.DEFAULT_EMAIL_TO;
  try {
    return transporter.sendMail(emailOptions);
  } catch (e) {
    throw e;
  }
};

const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const pug = require('pug');
const path = require('path');
const { htmlToText } = require('html-to-text');

dotenv.config({ path: './config.env' });

class Email {
  constructor(to) {
    this.to = to;
  }

  newTrasport() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
    // return nodemailer.createTransport({
    //   host: 'sandbox.smtp.mailtrap.io',
    //   port: 2525,
    //   auth: {
    //     user: process.env.MAILTRAP_USER,
    //     pass: process.env.MAILTRAP_PASSWORD,
    //   },
    // });
  }

  //enviar el correo actual

  async send(template, subject, mailData) {
    const html = pug.renderFile(
      path.join(__dirname, '..', 'views', 'emails', `${template}.pug`),
      mailData
    );

    await this.newTrasport().sendMail({
      from: process.env.MAIL_FROM,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    });
  }
  async sendWelcome(name) {
    await this.send(
      'welcome',
      'Bienvenido, eres el nuevo usuario de nuestra app',
      { name }
    );
  }
  async sendNewPost(title, content) {
    await this.send(
      'newPost',
      'Genial, tu nuevo post ha sido creado, felicidades',
      { title, content }
    );
  }
}

module.exports = { Email };

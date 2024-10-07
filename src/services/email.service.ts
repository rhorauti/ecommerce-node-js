import { IUser } from '@src/core/interfaces/IUser';
import { NextFunction } from 'express';
import { injectable } from 'inversify';
import nodemailer from 'nodemailer';

@injectable()
export class EmailSender {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendEmailConfirmationSignUp(user: IUser, token: string, next: NextFunction): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Confirme o seu cadastro!',
        html: `  <h2>Olá ${user.username}!</h2> 
        <p>Para confirmar seu cadastro na Atari, clique no link abaixo:</p><br>
        <h3><p><a href="${process.env.URL_FRONT}/redirect?token=${token}" target="_blank">Confirmar cadastro</a></p></h3><br>
        <p>Se você não solicitou este e-mail, por favor, ignore-o. Caso contrário, prossiga com a confirmação do seu e-mail</p>
        <p>Atenciosamente,</p>
        <p>A Equipe ${process.env.COMPANY}</p>
        `,
        text: `Olá ${user.username}, Para confirmar seu cadastro, clique no link abaixo:`,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendEmailConfirmationResetPassword(
    user: IUser,
    token: string,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Recuperação de senha!`,
        html: `<h2>Olá ${user.username}!</h2>
        <p>Recebemos sua solicitação de recuperação de senha. Para criar uma nova senha, clique no link abaixo:</p><br>
        <h3><p><a href="${process.env.URL_FRONT}/new-password?token=${token}" target="_blank">Recuperar senha</a></p></h3><br>
        <p>Se você não solicitou a recuperação de senha, por favor, ignore este e-mail, por motivos de segurança.</p>
        <p>Tenha um ótimo dia!</p><br>
        <p>Atenciosamente,</p>
        <p>A Equipe ${process.env.COMPANY}</p>
        `,
        text: 'Olá, Para mudar sua senha, clique no link abaixo:',
      });
    } catch (error) {
      next(error);
    }
  }
}

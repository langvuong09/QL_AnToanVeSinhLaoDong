export default class Email {
    static sendMail: (email: string, subject: string, data_html: string, data_text?: string) => Promise<unknown>;
}

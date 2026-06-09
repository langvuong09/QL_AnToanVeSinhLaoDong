"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const smtpapi = __importStar(require("smtpapi"));
const nodemailer = __importStar(require("nodemailer"));
const EMAIL_SENDGRID_KEY = process.env.SENDGRID_KEY || '';
class Email {
    static sendMail = async (email, subject, data_html, data_text = '') => {
        const msg = {
            to: email,
            from: 'info@rcp.com.vn',
            subject: subject,
            text: data_text,
            html: data_html,
        };
        return new Promise((resolve, reject) => {
            const header = new smtpapi();
            const headers = {
                'x-smtpapi': header.jsonString()
            };
            const settings = {
                host: 'smtp.sendgrid.net',
                port: 587,
                requiresAuth: true,
                auth: {
                    user: 'apikey',
                    pass: EMAIL_SENDGRID_KEY,
                },
            };
            const smtpTransport = nodemailer.createTransport(settings);
            const mailOptionsNew = { ...msg, headers };
            smtpTransport.sendMail(mailOptionsNew, (error, response) => {
                smtpTransport.close();
                if (error) {
                    common_1.Logger.error(error);
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    };
}
exports.default = Email;
//# sourceMappingURL=Email.js.map
import axios from 'axios';

interface SendSMSParams {
  phone: string;
  message: string;
}

export class SMSService {
  private static formatPhoneNumber(phone: string): string {
    return phone.startsWith('00') ? `+${phone.slice(2)}` : phone;
  }

  private static createSMSPayload(phone: string, message: string): URLSearchParams {
    return new URLSearchParams({
      username: process.env.NEXT_PUBLIC_USERNAME_MTARGET || '',
      password: process.env.NEXT_PUBLIC_PASSWORD_MTARGET || '',
      msisdn: this.formatPhoneNumber(phone),
      msg: message,
      sender: process.env.NEXT_PUBLIC_SENDER_MTARGET || '',
      allowunicode: 'true'
    });
  }
 

  static async sendSMS({ phone, message }: SendSMSParams): Promise<boolean> {
    try {
      const data = this.createSMSPayload(phone, message);
      await axios.post(process.env.NEXT_PUBLIC_URL_MTARGET, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  static async sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const message = `Votre code de vérification est: ${code}`;
    
    const sent = await this.sendSMS({ phone, message });
    return {
      success: sent,
      code: sent ? code : undefined
    };
  }
}

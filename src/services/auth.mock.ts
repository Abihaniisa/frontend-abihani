import { UserProfile } from '../types/user.types';
import { INITIAL_CURRENT_USER } from '../constants/seedData';

interface AuthSession {
  user: UserProfile;
  token: string;
  recoveryCode: string;
}

class AuthMockService {
  private activeUser: UserProfile = INITIAL_CURRENT_USER;
  private generatedOtp: string = '123456';
  private linkedAccounts: UserProfile[] = [INITIAL_CURRENT_USER];

  public async requestPhoneOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp = code;

    console.log(
      `%c[Abihani Auth Mock] Phone OTP for ${phone}: %c${code}`,
      'background: #0B0B0F; color: #E7C27A; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'background: #C41E3A; color: #FFFFFF; font-weight: 800; font-size: 16px; padding: 4px 8px; border-radius: 4px;'
    );

    return {
      success: true,
      message: 'OTP sent. Check the browser console.',
    };
  }

  public async verifyPhoneOtp(phone: string, code: string): Promise<AuthSession> {
    if (code !== this.generatedOtp && code !== '123456' && code !== '000000') {
      throw new Error('That code is not correct. Try again.');
    }

    const recoveryCode = Math.floor(10000000 + Math.random() * 90000000).toString();

    const existing = this.linkedAccounts.find((a) => a.contactPhone === phone);

    if (existing) {
      this.activeUser = existing;
      return {
        user: existing,
        token: `mock_jwt_${Date.now()}`,
        recoveryCode,
      };
    }

    const digitsOnly = phone.replace(/\D/g, '');
    const handle = `user${digitsOnly.slice(-4)}`;

    const user: UserProfile = {
      ...this.activeUser,
      id: `usr_${Date.now()}`,
      contactPhone: phone,
      handle,
      displayName: 'Abihani User',
    };

    this.activeUser = user;
    this.linkedAccounts.push(user);

    return {
      user,
      token: `mock_jwt_${Date.now()}`,
      recoveryCode,
    };
  }

  public getCurrentUser(): UserProfile {
    return this.activeUser;
  }

  public updateCurrentUser(updates: Partial<UserProfile>): UserProfile {
    this.activeUser = { ...this.activeUser, ...updates };
    return this.activeUser;
  }

  public getLinkedAccounts(): UserProfile[] {
    return this.linkedAccounts;
  }

  public switchAccount(userId: string): UserProfile {
    const target = this.linkedAccounts.find((a) => a.id === userId);
    if (!target) throw new Error('Account not found on this device');
    this.activeUser = target;
    return this.activeUser;
  }

  public logout(): void {
    this.linkedAccounts = [];
  }
}

export const authMock = new AuthMockService();
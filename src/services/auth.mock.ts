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

  public async requestEmailOtp(email: string): Promise<{ success: boolean; message: string }> {
    // Generate 6 digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp = code;

    // Output to browser console as mandated by specification
    console.log(
      `%c[Abihani Auth Mock] ✉️ Email OTP for ${email}: %c${code}`,
      'background: #0B0B0F; color: #E7C27A; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'background: #C41E3A; color: #FFFFFF; font-weight: 800; font-size: 16px; padding: 4px 8px; border-radius: 4px;'
    );

    return {
      success: true,
      message: 'OTP sent to your email. Check your browser developer console.',
    };
  }

  public async verifyEmailOtp(email: string, code: string): Promise<AuthSession> {
    // In mock mode, allow the generated code or 123456 or 000000
    if (code !== this.generatedOtp && code !== '123456' && code !== '000000') {
      throw new Error('Invalid or expired verification code');
    }

    // 8-digit recovery code shown once
    const recoveryCode = Math.floor(10000000 + Math.random() * 90000000).toString();

    const handle = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const user: UserProfile = {
      ...this.activeUser,
      email,
      handle: handle || 'user',
      displayName: handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'Abihani User',
    };

    this.activeUser = user;
    if (!this.linkedAccounts.some((a) => a.email === email)) {
      this.linkedAccounts.push(user);
    }

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

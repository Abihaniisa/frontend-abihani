import { NigerianBanks } from '../constants/banks';

class ApiMockService {
  public async verifyBankAccount(bankId: string, accountNumber: string): Promise<{ accountName: string }> {
    // Artificial slight delay for realistic verification lookup
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (accountNumber.length !== 10) {
      throw new Error('Nigerian NUBAN must be exactly 10 digits');
    }

    const bank = NigerianBanks.find((b) => b.id === bankId);
    const bankLabel = bank ? bank.name.split(' ')[0].toUpperCase() : 'NIGERIAN';

    // Generates a mock uppercase verified Nigerian business or personal name
    const suffixes = ['ENTERPRISES', 'VENTURES', 'ATELIER', 'STORES', 'TRADING'];
    const suffix = suffixes[parseInt(accountNumber.slice(-1), 10) % suffixes.length];

    return {
      accountName: `ABIHANI SELLER ${bankLabel} ${suffix}`,
    };
  }

  public async searchContent(query: string): Promise<{ query: string }> {
    return { query };
  }
}

export const apiMock = new ApiMockService();

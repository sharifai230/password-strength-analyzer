
export enum View {
  Home = 'Home',
  Admin = 'Admin',
  Report = 'Report',
}

export interface ZxcvbnResult {
  score: 0 | 1 | 2 | 3 | 4;
  feedback: {
    warning: string;
    suggestions: string[];
  };
  crack_times_display: {
    online_throttling_100_per_hour: string;
    online_no_throttling_10_per_second: string;
    offline_slow_hashing_1e4_per_second: string;
    offline_fast_hashing_1e10_per_second: string;
  };
  sequence: any[];
}

export interface AuditReportData {
  strengthDistribution: { name: string; count: number }[];
  reuseRate: { name: string; value: number }[];
  topWeakPatterns: { pattern: string; count: number }[];
  accounts: { id: number; username: string; score: number }[];
}

// This is a global declaration for zxcvbn loaded from CDN
declare global {
  interface Window {
    zxcvbn: (password: string, userInputs?: string[]) => ZxcvbnResult;
  }
}

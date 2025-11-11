
import { AuditReportData } from '../types';

// The base URL for the FastAPI backend.
// This should be configurable in a real application.
const API_BASE_URL = 'http://localhost:8000';

/**
 * Checks a SHA-1 hash prefix against the Have I Been Pwned API.
 * This function simulates calling our own backend, which would then call HIBP.
 * @param prefix The first 5 characters of a SHA-1 hash.
 * @returns A promise that resolves to an array of matching hash suffixes.
 */
export const checkBreachPrefix = async (prefix: string): Promise<string[]> => {
  try {
    // In a real app, this would call our backend to avoid CORS issues and hide API keys if needed.
    // const response = await fetch(`${API_BASE_URL}/breach-check-prefix`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prefix }),
    // });
    // For this scaffold, we call the HIBP API directly.
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from Pwned Passwords API');
    }
    const text = await response.text();
    return text.split('\r\n').map(line => line.split(':')[0]);
  } catch (error) {
    console.error("Error in checkBreachPrefix:", error);
    // Return empty array on failure to prevent breaking the UI
    return [];
  }
};


/**
 * Uploads a file containing account data for auditing.
 * @param file The CSV or JSON file to upload.
 * @returns A promise that resolves to a success message.
 */
export const uploadAccounts = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  // This simulates a real API call.
  // Replace with a fetch call to your backend when it's ready.
  // const response = await fetch(`${API_BASE_URL}/upload-accounts`, {
  //   method: 'POST',
  //   body: formData,
  // });
  // if (!response.ok) {
  //   const errorData = await response.json();
  //   throw new Error(errorData.detail || 'File upload failed');
  // }
  // return response.json();
  
  // Mocked response for frontend development
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ message: `Successfully processed ${file.name} with ${Math.floor(Math.random() * 100) + 10} accounts.` });
    }, 1500);
  });
};

/**
 * Fetches the audit report data from the backend.
 * @returns A promise that resolves to the audit report data.
 */
export const getAuditReport = async (): Promise<AuditReportData> => {
  // This simulates a real API call.
  // const response = await fetch(`${API_BASE_URL}/audit-report`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch audit report');
  // }
  // return response.json();

  // Mocked response for frontend development
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        strengthDistribution: [
          { name: 'Very Weak (0)', count: 15 },
          { name: 'Weak (1)', count: 45 },
          { name: 'Moderate (2)', count: 25 },
          { name: 'Strong (3)', count: 10 },
          { name: 'Very Strong (4)', count: 5 },
        ],
        reuseRate: [
          { name: 'Unique', value: 70 },
          { name: 'Reused', value: 30 },
        ],
        topWeakPatterns: [
          { pattern: 'Company Name + Year', count: 12 },
          { pattern: 'Sequential numbers (123456)', count: 9 },
          { pattern: 'Keyboard patterns (qwerty)', count: 7 },
        ],
        accounts: [
          { id: 1, username: 'testuser1', score: 1 },
          { id: 2, username: 'testuser2', score: 0 },
          { id: 3, username: 'admin', score: 2 },
          { id: 4, username: 'j.doe', score: 3 },
          { id: 5, username: 'guest', score: 0 },
        ]
      });
    }, 1000);
  });
};


/**
 * Generates a strong password example.
 * @param username A string to ensure the password is not based on it.
 * @returns A promise resolving to a strong password string.
 */
export const generateStrongPassword = async (username: string): Promise<string> => {
  // In a real app, this might be a backend call to ensure strong randomness.
  // For this demo, client-side generation is sufficient.
  // This is NOT a service, just a utility, but keeping it here for API consistency.
  return new Promise((resolve) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    const array = new Uint32Array(16);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < 16; i++) {
        password += chars[array[i] % chars.length];
    }
    resolve(password);
  });
};

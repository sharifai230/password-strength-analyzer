
import React, { useState, useEffect, useCallback } from 'react';
import { ZxcvbnResult } from '../types';
import { checkBreachPrefix } from '../services/api';
import { sha1 } from '../utils/crypto';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

interface PasswordStrengthMeterProps {
  isLabMode: boolean;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ isLabMode }) => {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<ZxcvbnResult | null>(null);
  const [isPwned, setIsPwned] = useState<boolean | null>(null);
  const [isLoadingPwned, setIsLoadingPwned] = useState(false);
  const [pwnedError, setPwnedError] = useState('');

  useEffect(() => {
    if (password) {
      const result = window.zxcvbn(password);
      setStrength(result);
    } else {
      setStrength(null);
    }
    setIsPwned(null);
    setPwnedError('');
  }, [password]);

  const handleBreachCheck = useCallback(async () => {
    if (!password) return;
    setIsLoadingPwned(true);
    setIsPwned(null);
    setPwnedError('');
    try {
      const hash = await sha1(password);
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5).toUpperCase();
      
      const suffixes = await checkBreachPrefix(prefix);
      
      const pwned = suffixes.some(s => s === suffix);
      setIsPwned(pwned);

    } catch (error) {
      console.error("Breach check failed:", error);
      setPwnedError("Could not perform breach check. Please try again later.");
    } finally {
      setIsLoadingPwned(false);
    }
  }, [password]);

  const scoreColor = (score: number | undefined) => {
    switch (score) {
      case 0: return 'bg-red-600';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };
  
  const scoreText = (score: number | undefined) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return 'Enter a password';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Password Strength Analyzer</h2>
        <p className="mt-4 text-lg text-gray-400">Enter a password to test its strength and check if it has been exposed in a data breach.</p>
        {!isLabMode && (
           <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded-lg text-yellow-200 text-sm max-w-2xl mx-auto">
             <strong>Warning:</strong> Lab Mode is disabled. Only enter passwords for accounts you have explicit, legal consent to audit. Never test passwords for accounts you do not own.
           </div>
        )}
      </div>

      <Card>
        <div className="p-6">
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a password to test"
            autoComplete="new-password"
          />
        </div>
        
        {strength && (
          <div className="p-6 border-t border-gray-700 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Strength: {scoreText(strength.score)}</h3>
            </div>
            <ProgressBar percentage={(strength.score / 4) * 100} colorClass={scoreColor(strength.score)} />

            <div>
              <p className="text-sm text-gray-400">Estimated time to crack (offline, fast hashing):</p>
              <p className="font-mono text-blue-300">{strength.crack_times_display.offline_fast_hashing_1e10_per_second}</p>
            </div>
            
            {strength.feedback.warning && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-sm">
                <strong>Warning:</strong> {strength.feedback.warning}
              </div>
            )}
            
            {strength.feedback.suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-200">Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  {strength.feedback.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
               <Button onClick={handleBreachCheck} disabled={isLoadingPwned || !password}>
                {isLoadingPwned ? <Spinner /> : 'Check for Breaches'}
              </Button>
              {isPwned !== null && !isLoadingPwned && (
                <div className={`text-sm font-bold ${isPwned ? 'text-red-400' : 'text-green-400'}`}>
                    {isPwned 
                        ? "Oh no — this password has been found in a data breach!"
                        : "Good news — this password was not found in any known breaches."
                    }
                </div>
              )}
              {pwnedError && <p className="text-sm text-red-400">{pwnedError}</p>}
            </div>
            <p className="text-xs text-gray-500 pt-2">
              The breach check uses k-anonymity. Your full password is never sent to any server. We hash it, send only the first 5 characters of the hash, and check the results locally.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PasswordStrengthMeter;

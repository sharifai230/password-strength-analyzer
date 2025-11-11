
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Legend as RechartsLegend } from 'recharts';
import { getAuditReport, generateStrongPassword } from '../services/api';
import { AuditReportData } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';

const COLORS = ['#d946ef', '#14b8a6'];
const STRENGTH_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#22c55e'];

const AuditReport: React.FC = () => {
  const [report, setReport] = useState<AuditReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remediatedPassword, setRemediatedPassword] = useState<{ id: number; pass: string } | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getAuditReport();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load audit report.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleRemediate = async (accountId: number, username: string) => {
    try {
        const newPassword = await generateStrongPassword(username);
        setRemediatedPassword({ id: accountId, pass: newPassword });
    } catch (err) {
        alert("Failed to generate a new password.");
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
        <span className="ml-4 text-lg">Generating Audit Report...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  if (!report) {
    return <div className="text-center text-gray-400">No data available to generate a report. Please upload account data first.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Password Security Audit Report</h2>
        <p className="mt-4 text-lg text-gray-400">An overview of password health across the audited accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Password Strength Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.strengthDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="name" stroke="#a0aec0" />
                <YAxis stroke="#a0aec0" />
                <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                <Bar dataKey="count" name="Accounts" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Password Reuse Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={report.reuseRate} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {report.reuseRate.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                <RechartsLegend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Account Details & Remediation</h3>
           <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3">Username</th>
                  <th className="p-3">Strength Score</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {report.accounts.map(acc => (
                  <tr key={acc.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-3">{acc.username}</td>
                    <td className="p-3">
                        <span className="font-bold" style={{color: STRENGTH_COLORS[acc.score]}}>{acc.score} / 4</span>
                    </td>
                    <td className="p-3">
                      {remediatedPassword?.id === acc.id ? (
                        <div className="bg-gray-900 p-2 rounded-md">
                            <code className="text-green-300">{remediatedPassword.pass}</code>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleRemediate(acc.id, acc.username)}>Remediate</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuditReport;

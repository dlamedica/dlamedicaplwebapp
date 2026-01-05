// 🔒 BEZPIECZEŃSTWO: Security Dashboard - unikalny interfejs zarządzania bezpieczeństwem

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SecurityMetrics from './SecurityMetrics';
import SecurityTimeline from './SecurityTimeline';
import SecurityChart from './SecurityChart';
import SecurityAlert from './SecurityAlert';
import SecurityStatusIndicator from './SecurityStatusIndicator';

interface SecurityStats {
  unauthorizedAccess: number;
  rateLimitExceeded: number;
  failedAuth: number;
  suspiciousActivity: number;
  injectionAttempts: number;
  sensitiveDataChanges: number;
}

interface SecurityLog {
  type: string;
  timestamp: string;
  ip: string;
  path: string;
  method: string;
  activity?: string;
  details?: any;
}

const SecurityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'logs' | 'settings'>('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSecurityData();
    }
  }, [user]);

  const fetchSecurityData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch('/api/security/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        fetch('/api/security/logs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setLogs(logsData.logs || []);
      }
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-24 h-24 mx-auto border-4 border-red-500 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-500 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Brak dostępu</h2>
          <p className="text-gray-400">Tylko administratorzy mogą przeglądać ten panel.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Ładowanie danych bezpieczeństwa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white rounded"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Panel Bezpieczeństwa</h1>
              <p className="text-gray-400">Monitorowanie i zarządzanie bezpieczeństwem systemu</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'overview'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Przegląd
          </button>
          <button
            onClick={() => setSelectedTab('logs')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'logs'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Logi
          </button>
          <button
            onClick={() => setSelectedTab('settings')}
            className={`px-6 py-3 font-medium transition-colors ${
              selectedTab === 'settings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ustawienia
          </button>
        </div>

        {/* Content */}
        {selectedTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Status Indicator */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">Status bezpieczeństwa</h2>
                  <p className="text-gray-400 text-sm">Ogólny stan zabezpieczeń systemu</p>
                </div>
                <SecurityStatusIndicator
                  status={stats.injectionAttempts > 10 ? 'critical' : stats.suspiciousActivity > 50 ? 'warning' : 'secure'}
                  size="lg"
                />
              </div>
            </div>

            {/* Security Alerts */}
            {stats.injectionAttempts > 0 && (
              <SecurityAlert
                type="danger"
                title="Wykryto próby ataków"
                message={`System zarejestrował ${stats.injectionAttempts} prób ataków injection. Wszystkie zostały zablokowane.`}
                timestamp={new Date().toISOString()}
              />
            )}

            {/* Metrics */}
            <SecurityMetrics
              metrics={[
                {
                  label: 'Nieautoryzowany dostęp',
                  value: stats.unauthorizedAccess,
                  max: 1000,
                  color: '#EF4444',
                },
                {
                  label: 'Przekroczenia limitu',
                  value: stats.rateLimitExceeded,
                  max: 500,
                  color: '#F59E0B',
                },
                {
                  label: 'Nieudane logowania',
                  value: stats.failedAuth,
                  max: 200,
                  color: '#EAB308',
                },
                {
                  label: 'Podejrzane aktywności',
                  value: stats.suspiciousActivity,
                  max: 100,
                  color: '#A855F7',
                },
                {
                  label: 'Próby ataków',
                  value: stats.injectionAttempts,
                  max: 50,
                  color: '#DC2626',
                },
                {
                  label: 'Zmiany danych',
                  value: stats.sensitiveDataChanges,
                  max: 100,
                  color: '#3B82F6',
                },
              ]}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SecurityChart
                title="Aktywność w czasie"
                data={[
                  { label: '00:00', value: 5, color: '#3B82F6' },
                  { label: '04:00', value: 3, color: '#3B82F6' },
                  { label: '08:00', value: 12, color: '#3B82F6' },
                  { label: '12:00', value: 18, color: '#3B82F6' },
                  { label: '16:00', value: 15, color: '#3B82F6' },
                  { label: '20:00', value: 8, color: '#3B82F6' },
                ]}
                type="line"
              />
              <SecurityChart
                title="Typy zdarzeń"
                data={[
                  { label: 'Ataki', value: stats.injectionAttempts, color: '#EF4444' },
                  { label: 'Ostrzeżenia', value: stats.suspiciousActivity, color: '#F59E0B' },
                  { label: 'Błędy', value: stats.failedAuth, color: '#EAB308' },
                  { label: 'Info', value: stats.sensitiveDataChanges, color: '#3B82F6' },
                ]}
                type="bar"
              />
            </div>
          </div>
        )}

        {selectedTab === 'logs' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Ostatnie zdarzenia bezpieczeństwa</h2>
              
              {/* Timeline View */}
              <SecurityTimeline
                events={logs.slice(0, 10).map((log) => ({
                  id: log.timestamp,
                  type: log.type.includes('INJECTION') || log.type.includes('UNAUTHORIZED')
                    ? 'attack'
                    : log.type.includes('RATE_LIMIT') || log.type.includes('SUSPICIOUS')
                    ? 'warning'
                    : log.type.includes('SENSITIVE')
                    ? 'info'
                    : 'success',
                  title: log.type.replace(/_/g, ' '),
                  description: log.activity || `${log.method} ${log.path}`,
                  timestamp: log.timestamp,
                  ip: log.ip,
                }))}
              />
            </div>

            {/* Table View (Alternative) */}
            <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Typ</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Czas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ścieżka</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Szczegóły</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {logs.map((log, index) => (
                      <LogRow key={index} log={log} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'settings' && (
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Ustawienia bezpieczeństwa</h2>
            <div className="space-y-4">
              <SecuritySetting
                title="Rate Limiting"
                description="Ograniczenie liczby requestów na minutę"
                enabled={true}
              />
              <SecuritySetting
                title="CSRF Protection"
                description="Ochrona przed atakami CSRF"
                enabled={true}
              />
              <SecuritySetting
                title="IP Blocking"
                description="Automatyczna blokada podejrzanych IP"
                enabled={true}
              />
              <SecuritySetting
                title="Audit Logging"
                description="Logowanie wszystkich operacji"
                enabled={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  color: 'red' | 'orange' | 'yellow' | 'purple' | 'blue';
  trend: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  const colorClasses = {
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses[color]}`}></div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value.toLocaleString()}</span>
        <span className="text-gray-500 text-sm">zdarzeń</span>
      </div>
      <div className="mt-4 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          style={{ width: `${Math.min(100, (value / 1000) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

// Custom Log Row Component
const LogRow: React.FC<{ log: SecurityLog }> = ({ log }) => {
  const getTypeColor = (type: string) => {
    if (type.includes('UNAUTHORIZED') || type.includes('INJECTION')) return 'text-red-400';
    if (type.includes('RATE_LIMIT')) return 'text-orange-400';
    if (type.includes('FAILED_AUTH')) return 'text-yellow-400';
    if (type.includes('SUSPICIOUS')) return 'text-purple-400';
    return 'text-blue-400';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('pl-PL');
  };

  return (
    <tr className="hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`font-medium ${getTypeColor(log.type)}`}>
          {log.type.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        {formatTimestamp(log.timestamp)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
        {log.ip}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
        <span className="px-2 py-1 bg-gray-700 rounded text-xs">{log.method}</span>
        <span className="ml-2">{log.path}</span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-400">
        {log.activity || '-'}
      </td>
    </tr>
  );
};

// Custom Security Setting Component
interface SecuritySettingProps {
  title: string;
  description: string;
  enabled: boolean;
}

const SecuritySetting: React.FC<SecuritySettingProps> = ({ title, description, enabled }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
      <div>
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={`relative w-12 h-6 rounded-full transition-colors ${
            enabled ? 'bg-blue-500' : 'bg-gray-600'
          }`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          ></div>
        </div>
        <span className={`text-sm font-medium ${enabled ? 'text-green-400' : 'text-gray-500'}`}>
          {enabled ? 'Włączone' : 'Wyłączone'}
        </span>
      </div>
    </div>
  );
};

export default SecurityDashboard;


import React, { useState } from 'react';
import { FormSelect } from './components/FormSelect';
import { ScriptViewer } from './components/ScriptViewer';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ServerRam, WorkloadType, NetworkCondition, OptimizationConfig, GeneratedResult } from './types';
import { generateTcpScript } from './services/geminiService';
import { Server, Database, Wifi, Globe, Cpu, HardDrive, Play, AlertTriangle, Loader2, Zap } from './components/Icons';

const App: React.FC = () => {
  const [config, setConfig] = useState<OptimizationConfig>({
    ram: ServerRam.MEDIUM,
    workload: WorkloadType.WEB_SERVER,
    network: NetworkCondition.STANDARD_1G,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateTcpScript(config);
      setResult(data);
    } catch (err) {
      setError("Failed to generate script. Please check your API key or try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Configuration Options Maps
  const ramOptions = [
    { value: ServerRam.LOW, label: '< 4GB', description: 'Low Memory / VPS', icon: <Cpu size={18}/> },
    { value: ServerRam.MEDIUM, label: '4GB - 16GB', description: 'Standard Production', icon: <Server size={18}/> },
    { value: ServerRam.HIGH, label: '16GB - 64GB', description: 'High Performance', icon: <HardDrive size={18}/> },
    { value: ServerRam.EXTREME, label: '> 64GB', description: 'Enterprise / Cluster', icon: <Database size={18}/> },
  ];

  const workloadOptions = [
    { value: WorkloadType.WEB_SERVER, label: 'Web Server', description: 'Nginx/Apache (High Concurrency)', icon: <Globe size={18}/> },
    { value: WorkloadType.DATABASE, label: 'Database', description: 'Redis/Postgres (Persistent Conns)', icon: <Database size={18}/> },
    { value: WorkloadType.LOW_LATENCY, label: 'Low Latency', description: 'Gaming / VoIP', icon: <Cpu size={18}/> },
    { value: WorkloadType.GENERAL, label: 'General Purpose', description: 'Balanced Workload', icon: <Server size={18}/> },
  ];

  const networkOptions = [
    { value: NetworkCondition.STANDARD_1G, label: 'Standard (1Gbps)', description: 'Typical Cloud/DC', icon: <Wifi size={18}/> },
    { value: NetworkCondition.HIGH_SPEED_10G_PLUS, label: 'High Speed (10Gbps+)', description: 'High Throughput Intranet', icon: <Zap size={18}/> },
    { value: NetworkCondition.LOSSY_WIRELESS, label: 'High Packet Loss', description: 'Wireless / Satellite', icon: <AlertTriangle size={18}/> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-4xl w-full mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary-600/20 rounded-2xl mb-4 ring-1 ring-primary-500/50 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          <Server className="text-primary-400 h-8 w-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight mb-4">
          Ubuntu TCP Optimizer
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Generate kernel-level TCP tuning scripts tailored to your server's hardware and workload using AI analysis.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Configuration Card */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-800">
            <div className="h-2 w-2 rounded-full bg-primary-500 shadow-[0_0_8px_#3b82f6]"></div>
            <h2 className="text-lg font-semibold text-gray-200">System Configuration</h2>
          </div>

          <div className="space-y-8">
            <FormSelect 
              label="Total RAM Available" 
              options={ramOptions} 
              value={config.ram} 
              onChange={(v) => setConfig({...config, ram: v as ServerRam})} 
            />
            
            <FormSelect 
              label="Primary Workload" 
              options={workloadOptions} 
              value={config.workload} 
              onChange={(v) => setConfig({...config, workload: v as WorkloadType})} 
            />

            <FormSelect 
              label="Network Environment" 
              options={networkOptions} 
              value={config.network} 
              onChange={(v) => setConfig({...config, network: v as NetworkCondition})} 
            />
          </div>

          {/* Action Button */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300
                ${loading 
                  ? 'bg-gray-700 cursor-not-allowed opacity-70' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-[0.98]'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Analyzing & Generating...</span>
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  <span>Generate Optimization Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
            <AlertTriangle size={20} className="text-red-400" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <ScriptViewer script={result.bashScript} />
            <ExplanationPanel explanation={result.technicalExplanation} />
            
            <div className="flex justify-center mt-8 text-center">
              <p className="text-xs text-gray-500 max-w-md">
                Disclaimer: Always review generated scripts before applying them to production servers. 
                This tool uses AI to generate configuration based on best practices, but unique environments may require manual adjustments.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
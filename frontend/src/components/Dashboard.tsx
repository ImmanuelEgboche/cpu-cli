import { MetricsPanel } from "./MetricsPanel";
import { MonitoringTable } from "./MonitoringTable";
import { SystemAlerts } from "./SystemAlerts";
import { AgentQueue } from "./AgentQueue";
import { GlobalQueue } from "./GlobalQueue";
import { RadarVisualization } from "./RadarVisualization";
import { MasterControl } from "./MasterControl";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-4 overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 pb-3 border-b border-primary/30">
        <h1 className="text-2xl font-bold tracking-widest terminal-glow">SYSTEM MONITOR CLI</h1>
        <div className="px-3 py-1 border border-secondary text-secondary text-xs tracking-wider">
          v2.4.1 | REALTIME MONITORING
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <MonitoringTable />
          <SystemAlerts />
          <AgentQueue />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <MetricsPanel />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GlobalQueue />
            <RadarVisualization />
          </div>
        </div>
      </div>

      {/* Master Control */}
      <MasterControl />
    </div>
  );
};

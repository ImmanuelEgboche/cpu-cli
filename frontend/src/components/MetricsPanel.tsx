import { useEffect, useState } from "react";
import { api, SystemMetrics } from "@/lib/api";

export const MetricsPanel = () => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
  });

  // Simulate live updates
  useEffect(() => {
    const fetchMetrics = async() => {
      try {
        const data = await api.getMetrics();
        setMetrics({
          cpu: data.cpu,
          memory: data.memory,
          disk: data.disk,
          network: data.network_io,
        });
        
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    // Fetch immediately on mount
    fetchMetrics();

    const interval = setInterval(fetchMetrics, 2000)
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return "text-destructive terminal-glow-red";
    if (value >= thresholds.warning) return "text-secondary terminal-glow-amber";
    return "text-primary terminal-glow";
  };

  return (
    <div className="border border-primary/30 bg-card p-4">
      <div className="mb-3">
        <h3 className="text-xs text-secondary tracking-widest">SYSTEM RESOURCES</h3>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-primary/20 p-3">
          <div className="text-[10px] text-muted-foreground mb-1">CPU USAGE</div>
          <div className={`text-2xl font-bold mb-1 ${getStatusColor(metrics.cpu, { warning: 70, critical: 90 })}`}>
            {metrics.cpu.toFixed(1)}%
          </div>
          <div className="h-1 bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>

        <div className="border border-primary/20 p-3">
          <div className="text-[10px] text-muted-foreground mb-1">MEMORY</div>
          <div className={`text-2xl font-bold mb-1 ${getStatusColor(metrics.memory, { warning: 80, critical: 95 })}`}>
            {metrics.memory.toFixed(1)}%
          </div>
          <div className="h-1 bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </div>

        <div className="border border-primary/20 p-3">
          <div className="text-[10px] text-muted-foreground mb-1">DISK USAGE</div>
          <div className={`text-2xl font-bold mb-1 ${getStatusColor(metrics.disk, { warning: 85, critical: 95 })}`}>
            {metrics.disk.toFixed(1)}%
          </div>
          <div className="h-1 bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${metrics.disk}%` }}
            />
          </div>
        </div>

        <div className="border border-primary/20 p-3">
          <div className="text-[10px] text-muted-foreground mb-1">NETWORK I/O</div>
          <div className="text-2xl font-bold mb-1 text-primary terminal-glow">
            {metrics.network.toFixed(1)}
          </div>
          <div className="text-[10px] text-muted-foreground">MB/s</div>
        </div>
      </div>
    </div>
  );
};

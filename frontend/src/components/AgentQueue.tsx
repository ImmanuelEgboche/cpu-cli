import { useEffect, useState } from "react";
import { api, Process } from "@/lib/api";

interface Service {
  name: string;
  port: number;
  status: "active" | "inactive" | "error";
  uptime: string;
  requests: number;
}

export const AgentQueue = () => {
  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    //Function to fetch process data
    const fetchProcesses = async () => {
      try {
        const data = await api.getProcesses();
        setProcesses(data);
      } catch (error) {
        console.error('Failed to fetch processes', error);
      }
    };

    // Ftech immediately
    fetchProcesses();

    // Update every 2 seconds
    const interval = setInterval(fetchProcesses, 2000);
      
      return () => clearInterval(interval);
    }, []);

    const getStatusColor = (cpu: number) => {
      if (cpu >= 50) return "bg-destructive text-destructive-foreground";
      if (cpu >= 20) return "bg-secondary text-secondary-foreground";      // Amber if moderate
      return "bg-primary text-primary-foreground";                          // Green if light

    };

  return (
    <div className="border border-primary/30 bg-card p-4">
      <div className="mb-3">
        <h3 className="text-xs text-secondary tracking-widest mb-1">TOP PROCESSES</h3>
        <div className="text-[10px] text-muted-foreground">BY CPU USAGE</div>
      </div>
      <div className="space-y-2">
        {processes.map((process, idx) => (
          <div key={idx} className="border border-primary/20 p-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-bold truncate flex-1 mr-2">
                {process.name}
              </div>
              <div className={`px-2 py-0.5 text-[9px] font-bold ${getStatusColor(process.cpu_percent)}`}>
                CPU {process.cpu_percent.toFixed(1)}%
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
              <div>MEMORY: {process.memory_percent.toFixed(1)}%</div>
              <div className="text-right">RANK: #{idx + 1}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

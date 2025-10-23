import { useEffect, useState } from "react";
import { api, Alert } from "@/lib/api";

export const SystemAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() =>{
    const fetchAlerts = async () => {
      try{
        const data = await api.getAlerts();
        setAlerts(data);
      } catch(error){
        console.error('Failed to fetch', error)
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-destructive text-destructive-foreground";
      case "WARNING": return "bg-secondary text-secondary-foreground";
      case "INFO": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  }

  return (
    <div className="border border-primary/30 bg-card p-4">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="text-xs text-secondary tracking-widest">SYSTEM ALERTS</h3>
        <div className="text-[10px] text-muted-foreground">{alerts.length} ACTIVE</div>
      </div>
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div className="border border-primary/20 p-3 text-center">
            <div className="text-xs text-muted-foreground">No alerts - System healthy</div>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="border border-primary/20 p-2">
              <div className="flex items-start justify-between mb-1">
                <div className="text-xs text-primary">{alert.id}</div>
                <div className={`px-2 py-0.5 text-[9px] font-bold ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </div>
              </div>
              <div className="text-[11px] font-bold mb-1">{alert.title}</div>
              <div className="text-[10px] text-muted-foreground mb-1">{alert.message}</div>
              <div className="text-[9px] text-muted-foreground">{alert.timestamp}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

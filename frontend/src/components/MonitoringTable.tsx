import { useEffect, useState } from "react";
import { api, Connection } from "@/lib/api";
import { clear } from "console";



export const MonitoringTable = () => {
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await api.getConnections();
        setConnections(data);
      } catch (error) {
        console.error('Failed to fetch connections', error);
      }
    };
    
    fetchConnections();

    const interval = setInterval(fetchConnections, 5000)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-secondary/50 bg-card">
      <div className="bg-secondary/20 px-3 py-1 border-b border-secondary/50">
        <h2 className="text-xs font-bold tracking-widest text-secondary">NETWORK CONNECTIONS</h2>
      </div>
      <div className="p-3">
        {connections.length === 0 ? (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No active connections detected
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-primary/20">
                <th className="text-left pb-2 font-normal text-muted-foreground">ID</th>
                <th className="text-left pb-2 font-normal text-muted-foreground">LOCAL</th>
                <th className="text-left pb-2 font-normal text-muted-foreground">REMOTE</th>
                <th className="text-left pb-2 font-normal text-muted-foreground">TYPE</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((conn) => (
                <tr key={conn.id} className="border-b border-primary/10">
                  <td className="py-2 text-primary">{conn.id}</td>
                  <td className="py-2 text-muted-foreground font-mono text-[10px]">{conn.local}</td>
                  <td className="py-2 text-primary font-mono text-[10px]">{conn.remote}</td>
                  <td className="py-2">
                    <span className="px-2 py-0.5 border border-secondary text-secondary text-[9px]">
                      {conn.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
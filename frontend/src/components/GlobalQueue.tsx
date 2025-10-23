import { useEffect, useState } from "react";
import { api, Service } from '@/lib/api';
import { clear } from "console";
import { stat } from "fs";


export const GlobalQueue = () => {
  const [services, SetServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        SetServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();

    const interval = setInterval(fetchServices, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CRITICAL": return "bg-destructive";
      case "WARNING": return "bg-secondary";
      case "HEALTHY": return "bg-primary";
      default: return "bg-muted";
    }
    };

  return (
    <div className="border border-primary/30 bg-card p-4">
      <div className="mb-3">
        <h3 className="text-xs text-secondary tracking-widest mb-1">SERVICE STATUS</h3>
      </div>
      <div className="space-y-3">
        {services.map((service, idx) => (
          <div key={idx} className="border border-primary/20 p-2">
            <div className="text-xs mb-1">{service.name}</div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-0.5 ${getStatusColor(service.status)} text-primary-foreground text-[10px] font-bold`}>
                {service.status}
              </div>
              <div className="text-[10px] text-muted-foreground">
                LOAD: {service.load} ({service.value.toFixed(1)}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

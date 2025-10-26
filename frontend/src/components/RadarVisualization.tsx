import { useEffect, useState } from "react";
import { api, SystemMetrics } from "@/lib/api"

export const RadarVisualization = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000)
    return () => clearInterval(interval)
  }, []);

  if (!metrics) {
    return (
      <div className="border border-primary/30 bg-card p-4">
        <div className="mb-3">
          <h3 className="text-xs text-secondary tracking-widest">SYSTEM HEALTH RADAR</h3>
        </div>
        <div className="aspect-square flex items-center justify-center text-xs text-muted-foreground">
          Loading...
        </div>
      </div>
    ); 
  }

  const radarData = [
    { name: "CPU", value: metrics.cpu, angle: -90, color: "hsl(var(--terminal-green))" },      // North
    { name: "MEMORY", value: metrics.memory, angle: 0, color: "hsl(var(--terminal-amber))" },  // East
    { name: "DISK", value: metrics.disk, angle: 90, color: "hsl(var(--terminal-red))" },       // South
    { name: "NETWORK", value: Math.min((metrics.network_io / 200) * 100, 100), angle: 180, color: "hsl(var(--terminal-green))" }, // West, normalized to 200 MB/s max
  ]

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(rad),
      y: 200 + radius * Math.sin(rad),
    };
  };

  const getRadius = (percent: number) => {
    return (Math.min(percent, 100) / 100) * 160;
  }

  const getStatusColor = (value: number, metric: string) => {
    if (metric === "CPU" && value > 80) return "hsl(var(--terminal-red))";
    if (metric === "MEMORY" && value > 85) return "hsl(var(--terminal-red))";
    if (metric === "DISK" && value > 90) return "hsl(var(--terminal-red))";
    if (metric === "CPU" && value > 60) return "hsl(var(--terminal-amber))";
    if (metric === "MEMORY" && value > 70) return "hsl(var(--terminal-amber))";
    if (metric === "DISK" && value > 80) return "hsl(var(--terminal-amber))";
    return "hsl(var(--terminal-green))";
  }

  // creating polygon
  const polygonPoints = radarData
  .map((data) => {
    const radius = getRadius(data.value);
    const pos = polarToCartesian(data.angle, radius)
    return `${pos.x}, ${pos.y}`;
  })
  .join(" ");
  return (
    <div className="border border-primary/30 bg-card p-4">
      <div className="mb-3">
        <h3 className="text-xs text-secondary tracking-widest">SYSTEM HEALTH RADAR</h3>
      </div>
      <div className="relative aspect-square max-w-md mx-auto">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Background concentric circles (percentage rings) */}
          {[160, 120, 80, 40].map((r, i) => (
            <circle
              key={i}
              cx="200"
              cy="200"
              r={r}
              fill="none"
              stroke="hsl(var(--terminal-green-dim))"
              strokeWidth="1"
              opacity="0.2"
            />
          ))}

          {/* Percentage labels */}
          <text x="205" y="50" fontSize="8" fill="hsl(var(--terminal-green-dim))" opacity="0.4">100%</text>
          <text x="205" y="90" fontSize="8" fill="hsl(var(--terminal-green-dim))" opacity="0.4">75%</text>
          <text x="205" y="130" fontSize="8" fill="hsl(var(--terminal-green-dim))" opacity="0.4">50%</text>
          <text x="205" y="170" fontSize="8" fill="hsl(var(--terminal-green-dim))" opacity="0.4">25%</text>

          {/* Grid lines (cardinal directions) */}
          <line x1="200" y1="40" x2="200" y2="360" stroke="hsl(var(--terminal-green-dim))" strokeWidth="1" opacity="0.2" />
          <line x1="40" y1="200" x2="360" y2="200" stroke="hsl(var(--terminal-green-dim))" strokeWidth="1" opacity="0.2" />

          {/* Filled polygon showing system health */}
          <polygon
            points={polygonPoints}
            fill="hsl(var(--terminal-green))"
            fillOpacity="0.1"
            stroke="hsl(var(--terminal-green))"
            strokeWidth="2"
            strokeOpacity="0.6"
          />

          {/* Plot each metric point */}
          {radarData.map((data, idx) => {
            const radius = getRadius(data.value);
            const pos = polarToCartesian(data.angle, radius);
            const labelPos = polarToCartesian(data.angle, 185);
            const color = getStatusColor(data.value, data.name);

            return (
              <g key={idx}>
                {/* Connection line from center */}
                <line
                  x1="200"
                  y1="200"
                  x2={labelPos.x}
                  y2={labelPos.y}
                  stroke="hsl(var(--terminal-green-dim))"
                  strokeWidth="1"
                  opacity="0.3"
                />

                {/* Metric point */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="5"
                  fill={color}
                  stroke={color}
                  strokeWidth="2"
                  className="drop-shadow-[0_0_8px_currentColor]"
                  style={{ color }}
                />

                {/* Metric label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y - 8}
                  fontSize="9"
                  fontWeight="bold"
                  fill="hsl(var(--terminal-green))"
                  textAnchor="middle"
                >
                  {data.name}
                </text>

                {/* Metric value */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 5}
                  fontSize="10"
                  fontWeight="bold"
                  fill={color}
                  textAnchor="middle"
                >
                  {data.name === "NETWORK" 
                    ? `${metrics.network_io.toFixed(1)} MB/s`
                    : `${data.value.toFixed(1)}%`
                  }
                </text>
              </g>
            );
          })}

          {/* Center point */}
          <circle cx="200" cy="200" r="4" fill="hsl(var(--terminal-green))" />
          <text x="200" y="218" fontSize="8" fill="hsl(var(--terminal-green))" textAnchor="middle" fontWeight="bold">
            CORE
          </text>
        </svg>
      </div>
    </div>
  );
};

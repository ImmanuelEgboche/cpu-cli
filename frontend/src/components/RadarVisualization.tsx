export const RadarVisualization = () => {
  return (
    <div className="border border-primary/30 bg-card p-4">
      <div className="mb-3 flex justify-between items-center">
        <h3 className="text-xs text-secondary tracking-widest">STAGING AND INITIALIZATION ENVIRONMENT</h3>
      </div>
      <div className="relative aspect-square max-w-md mx-auto">
        {/* Concentric circles */}
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Grid circles */}
          <circle
            cx="200"
            cy="200"
            r="180"
            fill="none"
            stroke="hsl(var(--terminal-green-dim))"
            strokeWidth="1"
            opacity="0.3"
          />
          <circle
            cx="200"
            cy="200"
            r="140"
            fill="none"
            stroke="hsl(var(--terminal-green-dim))"
            strokeWidth="1"
            opacity="0.3"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            fill="none"
            stroke="hsl(var(--terminal-green-dim))"
            strokeWidth="1"
            opacity="0.3"
          />
          <circle
            cx="200"
            cy="200"
            r="60"
            fill="none"
            stroke="hsl(var(--terminal-green-dim))"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Grid lines */}
          <line x1="200" y1="20" x2="200" y2="380" stroke="hsl(var(--terminal-green-dim))" strokeWidth="1" opacity="0.2" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="hsl(var(--terminal-green-dim))" strokeWidth="1" opacity="0.2" />
          <line x1="73" y1="73" x2="327" y2="327" stroke="hsl(var(--terminal-green-dim))" strokeWidth="1" opacity="0.2" />
          <line x1="73" y1="327" x2="327" y2="73" stroke="hsl(var(--terminal-green-dim))" strokeWidth="1" opacity="0.2" />

          {/* Agent markers */}
          {/* Green agents (active) */}
          <circle cx="180" cy="120" r="3" fill="hsl(var(--terminal-green))" className="drop-shadow-[0_0_6px_hsl(var(--terminal-green))]" />
          <text x="180" y="115" fontSize="8" fill="hsl(var(--terminal-green))" textAnchor="middle">E-9</text>
          <text x="180" y="135" fontSize="7" fill="hsl(var(--terminal-green))" textAnchor="middle">00:16</text>

          <circle cx="260" cy="180" r="3" fill="hsl(var(--terminal-green))" className="drop-shadow-[0_0_6px_hsl(var(--terminal-green))]" />
          <text x="270" y="175" fontSize="8" fill="hsl(var(--terminal-green))" textAnchor="start">D-4</text>
          <text x="270" y="185" fontSize="7" fill="hsl(var(--terminal-green))" textAnchor="start">00:59</text>

          {/* Yellow agents (warnings) */}
          <circle cx="120" cy="250" r="3" fill="hsl(var(--terminal-amber))" className="drop-shadow-[0_0_6px_hsl(var(--terminal-amber))]" />
          <text x="110" y="245" fontSize="8" fill="hsl(var(--terminal-amber))" textAnchor="end">D-5</text>
          <text x="110" y="255" fontSize="7" fill="hsl(var(--terminal-amber))" textAnchor="end">00:36</text>

          <circle cx="310" cy="240" r="3" fill="hsl(var(--terminal-amber))" className="drop-shadow-[0_0_6px_hsl(var(--terminal-amber))]" />
          <text x="320" y="235" fontSize="8" fill="hsl(var(--terminal-amber))" textAnchor="start">E-3</text>
          <text x="320" y="245" fontSize="7" fill="hsl(var(--terminal-amber))" textAnchor="start">01:49</text>

          {/* Red agents (errors) */}
          <circle cx="270" cy="100" r="3" fill="hsl(var(--terminal-red))" className="drop-shadow-[0_0_6px_hsl(var(--terminal-red))]" />
          <text x="280" y="95" fontSize="8" fill="hsl(var(--terminal-red))" textAnchor="start">E-6</text>
          <text x="280" y="105" fontSize="7" fill="hsl(var(--terminal-red))" textAnchor="start">01:28</text>

          <circle cx="150" cy="310" r="3" fill="hsl(var(--terminal-red))" className="drop-shadow-[0_0_6px_hsl(var(--terminal-red))]" />
          <text x="140" y="305" fontSize="8" fill="hsl(var(--terminal-red))" textAnchor="end">M-2</text>
          <text x="140" y="315" fontSize="7" fill="hsl(var(--terminal-red))" textAnchor="end">00:11</text>
        </svg>

        {/* Center point */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="text-[8px] text-primary text-center mt-1">WO-513</div>
        </div>
      </div>
    </div>
  );
};

export const MasterControl = () => {
  return (
    <div className="border border-primary/30 bg-card">
      <div className="bg-primary/10 px-3 py-1 border-b border-primary/30">
        <h2 className="text-xs font-bold tracking-widest text-primary">SYSTEM CONTROL</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Status Bar */}
          <div className="lg:col-span-2 border border-primary/20 p-3">
            <div className="text-[10px] text-muted-foreground mb-2">SYSTEM STATUS</div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs">MONITORING ACTIVE</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                UPTIME: 72h 34m 18s
              </div>
              <div className="text-[10px] text-muted-foreground">
                LAST UPDATE: 2s ago
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-primary/20 p-3">
            <div className="text-[10px] text-muted-foreground mb-2">QUICK ACTIONS</div>
            <div className="flex gap-2 flex-wrap">
              <button className="px-2 py-1 border border-primary text-primary text-[10px] hover:bg-primary/10">
                REFRESH
              </button>
              <button className="px-2 py-1 border border-secondary text-secondary text-[10px] hover:bg-secondary/10">
                PAUSE
              </button>
              <button className="px-2 py-1 border border-destructive text-destructive text-[10px] hover:bg-destructive/10">
                STOP
              </button>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="mt-4 border border-primary/20 p-3">
          <div className="text-[10px] text-muted-foreground mb-2">MONITORING CONTROLS</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <button className="px-3 py-2 border border-primary bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30">
              LIVE MODE
            </button>
            <button className="px-3 py-2 border border-primary/30 text-foreground text-xs hover:bg-primary/10">
              SNAPSHOT
            </button>
            <button className="px-3 py-2 border border-primary/30 text-foreground text-xs hover:bg-primary/10">
              EXPORT LOGS
            </button>
            <button className="px-3 py-2 border border-primary/30 text-foreground text-xs hover:bg-primary/10">
              SETTINGS
            </button>
          </div>
        </div>

        {/* Update Interval */}
        <div className="mt-4 border border-primary/20 p-3">
          <div className="text-[10px] text-muted-foreground mb-2">UPDATE INTERVAL</div>
          <div className="flex items-center gap-3">
            <input 
              type="range" 
              min="1" 
              max="10" 
              defaultValue="2" 
              className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-primary font-bold min-w-[60px]">2.0s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

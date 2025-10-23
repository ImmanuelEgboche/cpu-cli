//For communication with the Flask backen

const API_BASE_URL = '';

// interface to match backend

export interface SystemMetrics {
    cpu: number;
    memory: number;
    disk: number;
    network_io: number;
    timestamp: number;
}

export interface Process {
    name: string;
    cpu_percent: number;
    memory_percent: number;
}

export interface Alert {
    id: string;
    title: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    message: string;
    timestamp: string;
}

export interface Service {
    name: string;
    status: 'CRITICAL' | 'WARNING' | 'HEALTHY';
    load: 'HIGH' | 'MEDIUM' | 'LOW';
    value: number;
}

export interface Connection {
    id: string;
    local: string;
    remote: string;
    status: string;
    type: string;
}

// API fucnttions

export const api = {
    async getMetrics(): Promise<SystemMetrics> {
        const response = await fetch('/api/metrics');
        if (!response.ok) throw new Error('Failed to fetch metrics');
        return response.json();
    },

    // top five processes
    async getProcesses(): Promise<Process[]> {
        const response = await fetch('/api/processes');
        if(!response.ok) throw new Error('Failed to fetch processes');
        return response.json();
    },

    async getAlerts(): Promise<Alert[]> {
        const response = await fetch('/api/alerts');
        if (!response.ok) throw new Error('Failed tp fetch alerts');
        return response.json()
    },
    /**
   * Fetch service status
   */
  async getServices(): Promise<Service[]> {
    const response = await fetch('/api/services');
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  },

  /**
   * Fetch network connections
   */
  async getConnections(): Promise<Connection[]> {
    const response = await fetch('/api/connections');
    if (!response.ok) throw new Error('Failed to fetch connections');
    return response.json();
  }
}
import psutil
import time
from collections import deque
from flask import Flask, jsonify
from flask_cors import CORS
import threading
from datetime import datetime


app = Flask(__name__)
CORS(app)

# Time series buffer keeps last 60 data points = 1 minute

history = {
    "cpu": deque(maxlen=60),
    "memory": deque(maxlen=60),
    "network": deque(maxlen=60)
}

process_cache = []

# Alert history 
alert_history = deque(maxlen=50)
last_alert_check = {'cpu':0, 'memory':0, 'disk': 0}

def check_and_create_alerts(metrics):
    """Check metrics and create alerts"""
    current_time = datetime.now().strftime("%H:%M:%S")

    #CPU Alerts
    if metrics['cpu'] > 90 and last_alert_check['cpu'] <= 90:
        alert_history.append({
            'id': f'ALERT-{len(alert_history)+1:03d}',
            'title': 'CRITICAL CPU USAGE',
            'severity': 'CRITICAL',
            'message': f'CPU usage reached {metrics["cpu"]:.1f}%',
            'timestamp': current_time
        })
    elif metrics['cpu'] > 70 and last_alert_check['cpu'] <= 70:
        alert_history.append({
            'id': f'ALERT-{len(alert_history)+1:03d}',
            'title': 'HIGH CPU USAGE',
            'severity': 'WARNING',
            'message': f'CPU usage at {metrics["cpu"]:.1f}%',
            'timestamp': current_time
        })
    
    # Memory Alerts
    if metrics['memory'] > 90 and last_alert_check['memory'] <= 90:
        alert_history.append({
            'id': f'ALERT-{len(alert_history)+1:03d}',
            'title': 'CRITICAL MEMORY USAGE',
            'severity': 'CRITICAL',
            'message': f'Memory usage at {metrics["memory"]:.1f}%',
            'timestamp': current_time
        })
    elif metrics['memory'] > 80 and last_alert_check['memory'] <= 80:
        alert_history.append({
            'id': f'ALERT-{len(alert_history)+1:03d}',
            'title': 'HIGH MEMORY USAGE',
            'severity': 'WARNING',
            'message': f'Memory usage at {metrics["memory"]:.1f}%',
            'timestamp': current_time
        })


    # Disk Alerts
    if metrics['disk'] > 90 and last_alert_check['disk'] <= 90:
        alert_history.append({
            'id': f'ALERT-{len(alert_history)+1:03d}',
            'title': 'DISK SPACE CRITICAL',
            'severity': 'CRITICAL',
            'message': f'Disk usage at {metrics["disk"]:.1f}%',
            'timestamp': current_time
        })
    elif metrics['disk'] > 85 and last_alert_check['disk'] <= 85:
        alert_history.append({
            'id': f'ALERT-{len(alert_history)+1:03d}',
            'title': 'DISK SPACE LOW',
            'severity': 'WARNING',
            'message': f'Disk usage at {metrics["disk"]:.1f}%',
            'timestamp': current_time
        })
    
    last_alert_check['cpu'] = metrics['cpu']
    last_alert_check['disk'] = metrics['disk']
    last_alert_check['memory'] = metrics['memory']

    if len(alert_history) == 0:
        alert_history.append({
            'id': 'ALERT-001',
            'title': 'SYSTEM MONITORING STARTED',
            'severity': 'INFO',
            'message': 'System monitor initialized successfully',
            'timestamp': current_time
        })


def collect_metrics():

    timestamp = time.time()

    cpu = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent


    #Network speed
    net = psutil.net_io_counters()
    network_io = (net.bytes_sent + net.bytes_recv) / 1024 /1024

    #Store in histiry
    history["cpu"].append((timestamp, cpu))
    history["memory"].append((timestamp, memory))
    history["network"].append((timestamp, network_io))

    metrics = {
        "cpu": cpu,
        "memory": memory,
        "disk": disk,
        "network_io": network_io,
        "timestamp": timestamp
    }

    check_and_create_alerts(metrics)

    return metrics


def update_processes():
    global process_cache
    while True:
        procs = []
        for p in psutil.process_iter(['name']):
            try:
                procs.append({
                    'name': p.info['name'],
                    'cpu_percent': p.cpu_percent(interval=0.1),
                    'memory_percent': p.memory_percent()
                })
            except:
                continue
        process_cache = sorted(procs, key=lambda x: x['cpu_percent'] or 0, reverse=True)[:5]
        time.sleep(2)

# Start background thread to update process cache
update_thread = threading.Thread(target=update_processes, daemon=True)
update_thread.start()

# Give it time to collect initial data
time.sleep(2)

@app.route('/api/metrics')
def get_metrics():
    """Current snapshot"""
    return jsonify(collect_metrics())

@app.route('/api/history/<metric>')
def get_history(metric):
    return jsonify(list(history.get(metric, [])))

@app.route('/api/processes')
def get_top_process():
    return jsonify(process_cache)

@app.route('/api/alerts')
def get_alerts():
    return jsonify(list(reversed(list(alert_history)))[:20])

@app.route('/api/services')
def get_services():
    cpu = psutil.cpu_percent(interval=0.1)
    memory = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent
    net = psutil.net_io_counters()
    network_io = (net.bytes_sent + net.bytes_recv) / 1024 /1024 

    metrics = {
        'cpu': cpu,
        'memory': memory,
        'disk': disk,
        'network_io': network_io
    }

    services = [
        {
            'name': 'SYSTEM',
            'status': 'CRITICAL' if metrics['cpu'] > 90 else 'WARNING' if metrics['cpu'] > 70 else 'HEALTHY',
            'load': 'HIGH' if metrics['cpu'] > 70 else 'MEDIUM' if metrics['cpu'] > 40 else 'LOW',
            'value': metrics['cpu']
        },
        {
            'name': 'MEMORY',
            'status': 'CRITICAL' if metrics['memory'] > 90 else 'WARNING' if metrics['memory'] > 80 else 'HEALTHY',
            'load': 'HIGH' if metrics['memory'] > 80 else 'MEDIUM' if metrics['memory'] > 60 else 'LOW',
            'value': metrics['memory']
        },
        {
            'name': 'DISK I/O',
            'status': 'CRITICAL' if metrics['disk'] > 95 else 'WARNING' if metrics['disk'] > 85 else 'HEALTHY',
            'load': 'HIGH' if metrics['disk'] > 80 else 'MEDIUM' if metrics['disk'] > 60 else 'LOW',
            'value': metrics['disk']
        },
        {
            'name': 'NETWORK',
            'status': 'HEALTHY',
            'load': 'HIGH' if metrics['network_io'] > 100 else 'MEDIUM' if metrics['network_io'] > 50 else 'LOW',
            'value': metrics['network_io']
        }
    ]

    return jsonify(services)

@app.route('/api/connections')
def get_network_connections():
    try:
        connections = []
        for conn in psutil.net_connections(kind='inet'):
            if conn.status == 'ESTABLISHED' and conn.raddr:
                connections.append({
                    'id': f'CONN-{len(connections)+1:03d}',
                    'local': f'{conn.laddr.ip}:{conn.laddr.port}',
                    'remote': f'{conn.raddr.ip}:{conn.raddr.port}',
                    'status': conn.status,
                    'type': 'TCP' if conn.type == 1 else 'UDP'
                })
        return jsonify(connections[:10])
    except:
        return jsonify([])


if __name__ == '__main__':
    app.run(port=5000, debug=True)
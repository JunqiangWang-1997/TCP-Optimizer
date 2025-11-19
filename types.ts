export enum ServerRam {
  LOW = 'LOW',       // < 4GB
  MEDIUM = 'MEDIUM', // 4GB - 16GB
  HIGH = 'HIGH',     // 16GB - 64GB
  EXTREME = 'EXTREME' // > 64GB
}

export enum WorkloadType {
  WEB_SERVER = 'WEB_SERVER',         // Nginx, Apache, high concurrency short connections
  DATABASE = 'DATABASE',             // Redis, MySQL, persistent connections
  FILE_SERVER = 'FILE_SERVER',       // High throughput
  LOW_LATENCY = 'LOW_LATENCY',       // Gaming, VoIP
  GENERAL = 'GENERAL'                // Balanced
}

export enum NetworkCondition {
  STANDARD_1G = 'STANDARD_1G',
  HIGH_SPEED_10G_PLUS = 'HIGH_SPEED_10G_PLUS',
  LOSSY_WIRELESS = 'LOSSY_WIRELESS'
}

export interface OptimizationConfig {
  ram: ServerRam;
  workload: WorkloadType;
  network: NetworkCondition;
}

export interface GeneratedResult {
  bashScript: string;
  technicalExplanation: string;
}

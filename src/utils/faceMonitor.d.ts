export interface ViolationReport {
  count: number;
  reason: string;
  timestamp: string;
}

export declare class FaceMonitor {
  constructor(videoElement: HTMLVideoElement | null, onViolationCallback: (report: ViolationReport) => void);
  startMonitoring(): Promise<{ success: boolean; fallback?: boolean; message?: string }>;
  stopMonitoring(): void;
  recordViolation(reason: string): void;
  isActive: boolean;
  violationCount: number;
}

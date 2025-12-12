export enum AppTab {
  VISUALIZER = 'VISUALIZER',
  AUDIT = 'AUDIT',
}

export interface TranscriptionSegment {
  text: string;
  isFinal: boolean;
  timestamp: number;
}

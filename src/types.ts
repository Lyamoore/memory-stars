export type Emotion = "happy" | "calm" | "sad" | "excited";

export type Memory = {
  id: string;
  title: string;
  description: string;
  date: string;
  emotion: Emotion;
  tags: string[];
  position: [number, number, number];
  connections: string[];
};

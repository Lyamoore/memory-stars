import type { Emotion } from "../types";

export const emotionColors: Record<Emotion, string> = {
  happy: "#ffd369",
  calm: "#89c2ff",
  sad: "#6a74ff",
  excited: "#ff75a0",
};

export const emotionToColor = (e: Emotion) => emotionColors[e] ?? "white"

export const emotionLabels: Record<Emotion, string> = {
  happy: "Радость",
  calm: "Спокойствие",
  sad: "Грусть",
  excited: "Волнение",
}

export type Category = {
  phrases: string[];
};

export type Categories = Record<string, Category>;

export type Phrases = {
  _id?: { $oid: string };
  username: string;
  categories: Categories;
};

// StreamElements access levels.
// https://docs.streamelements.com/chatbot/variables/user#access-levels
export const Level = {
  Everyone: 100,
  Subscriber: 250,
  Regular: 300,
  VIP: 400,
  Moderator: 500,
  SuperModerator: 1000,
  Broadcaster: 1500,
} as const;

export type Level = (typeof Level)[keyof typeof Level];

export const levelLabels: Record<Level, string> = {
  [Level.Everyone]: "Todos",
  [Level.Subscriber]: "Subscriber",
  [Level.Regular]: "Regular",
  [Level.VIP]: "VIP",
  [Level.Moderator]: "Moderador",
  [Level.SuperModerator]: "Super Moderador",
  [Level.Broadcaster]: "Streamer",
};

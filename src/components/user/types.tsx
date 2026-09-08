export type Token = {
  value: string;
  allow: number[];
  created_at: string;
};

export type User = {
  _id: { $oid: string };
  username: string;
  realname: string;
  email: string;
  steamid?: string;
  youtubeid?: string;
  role: number;
  tokens: Token[];
};

// Token permission
export const Allow = {
  WebSocket: 0,
  Phrases: 1,
  Counter: 2,
} as const;

export type Allow = (typeof Allow)[keyof typeof Allow];

export const allowLabels: Record<Allow, string> = {
  [Allow.WebSocket]: "WebSocket",
  [Allow.Phrases]: "Frases",
  [Allow.Counter]: "Contador",
};

export const allowDescriptions: Record<Allow, string> = {
  [Allow.WebSocket]: "Permite enviar mensagens via WebSocket.",
  [Allow.Phrases]: "Permite remover e/ou adicionar novas frases.",
  [Allow.Counter]: "Permite alterar o valor do contador.",
};

// Role
export const Role = {
  Admin: 0,
  Streamer: 10,
  Member: 20,
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const roleLabels: Record<Role, string> = {
  [Role.Admin]: "Administrador",
  [Role.Streamer]: "Streamer",
  [Role.Member]: "Membro",
};

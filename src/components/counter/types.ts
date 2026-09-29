export type Metadata = {
  time: string;
  sender: string;
  message: string;
};

export type Counter = {
  _id?: { $oid: string };
  uuid: string;
  username: string;
  value: number;
  metadata?: Metadata;
};

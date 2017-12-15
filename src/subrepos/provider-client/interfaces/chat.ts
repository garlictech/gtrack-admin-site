export interface IChatMessage {
  userId: string;
  message: string;
}

export interface IChatMessageSent extends IChatMessage {
  room: string;
}

export interface IChatMessageStored extends IChatMessage {
  timestamp: number;
}

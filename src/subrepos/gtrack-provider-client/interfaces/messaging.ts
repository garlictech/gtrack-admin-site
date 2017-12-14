import { IProviderInput } from './provider';

export interface IMessage {
  userId: string;
  message: string;
  context: string;
}

export interface IMessageSent extends IMessage, IProviderInput {}

export interface IMessageStored extends IMessageSent {
  timestamp: number;
  id: string;
}

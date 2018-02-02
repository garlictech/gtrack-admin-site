import { IProviderInput } from './provider';

export enum EMessageContentType {
  text = 'text',
  url = 'url',
  image = 'image',
  translateable = 'translateable'
}

export interface IMessageContentType {
  type: EMessageContentType;
  content: any;
}

export enum EMessageState {
  unread = 'unread',
  read = 'read',
  archived = 'archived'
}

export enum EMessagePrivacy {
  private = 'private',
  public = 'public',
  followers = 'followers'
}

export interface IMessage {
  userId: string;
  message: IMessageContentType[];
  context: string;
  state?: EMessageState;
  privacy?: EMessagePrivacy
}

export interface IMessageSent extends IMessage, IProviderInput { }

export interface IMessageStored extends IMessageSent {
  timestamp: number;
  id: string;
}

export interface IMessageStateChange extends IProviderInput {
  desiredState?: EMessageState;
  desiredPrivacy?: EMessagePrivacy;
  messageId: string;
}

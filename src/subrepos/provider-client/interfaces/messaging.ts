import { IProviderInput } from './provider';
import { EAuthRoles } from '..';

export enum EMessageContentType {
  text = 'text',
  url = 'url',
  image = 'image',
  translateable = 'translateable',
  any = 'any',
  title = 'title'
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
  followers = 'followers',
  featured = 'featured'
}

export interface IMessage {
  userId: string;
  message: IMessageContentType[];
  context: string;
  likes?: Array<any>;
  state?: EMessageState;
  privacy?: EMessagePrivacy;
  shareCount?: number;
}

export interface IMessageSent extends IMessage, IProviderInput {}

export interface IMessageStored extends IMessageSent {
  timestamp: number;
  id: string;
  likes?: {
    userId: string;
    role: EAuthRoles;
  }[];
  isModerated?: boolean;
}

export interface IMessageStateChange extends IProviderInput {
  desiredState?: EMessageState;
  desiredPrivacy?: EMessagePrivacy;
  messageId: string;
}

export interface IMessageLike {
  messageId: string;
  like: boolean;
}

export interface IMessageLikeInput extends IMessageLike, IProviderInput {}

export interface IMessageThread {
  partnerId: string;
  partnerRole: EAuthRoles;
  lastMessageContent: any;
  lastMessageTimestamp: number;
  lastMessageState?: EMessageState;
  lastMessageRole: EAuthRoles;
  lastMessageUserId: string;
}

export interface IMessageDelete extends IProviderInput {
  messageId: string;
  context: string;
}

export interface IMessageFeatured extends IProviderInput {
  messageId: string;
  isFeatured: boolean;
}

export interface IMessageModerate extends IProviderInput {
  messageId: string;
  isBanned: boolean;
  reason?: string;
}

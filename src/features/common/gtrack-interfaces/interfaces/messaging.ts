import { ProviderInput } from './provider';
import { EAuthRoles } from './roles';

export enum EMessageContentType {
  text = 'text',
  url = 'url',
  image = 'image',
  translateable = 'translateable',
  any = 'any',
  title = 'title'
}

export interface MessageContentType {
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

export interface Message {
  userId: string;
  message: Array<MessageContentType>;
  context: string;
  likes?: Array<any>;
  state?: EMessageState;
  privacy?: EMessagePrivacy;
  shareCount?: number;
}

export interface MessageSent extends Message, ProviderInput {}

export interface MessageStored extends MessageSent {
  timestamp: number;
  id: string;
  likes?: Array<{
    userId: string;
    role: EAuthRoles;
  }>;
  isModerated?: boolean;
}

export interface MessageStateChange extends ProviderInput {
  desiredState?: EMessageState;
  desiredPrivacy?: EMessagePrivacy;
  messageId: string;
}

export interface MessageLike {
  messageId: string;
  like: boolean;
}

export interface MessageLikeInput extends MessageLike, ProviderInput {}

export interface MessageThread {
  partnerId: string;
  partnerRole: EAuthRoles;
  lastMessageContent: any;
  lastMessageTimestamp: number;
  lastMessageState?: EMessageState;
  lastMessageRole: EAuthRoles;
  lastMessageUserId: string;
}

export interface MessageDelete extends ProviderInput {
  messageId: string;
  context: string;
}

export interface MessageFeatured extends ProviderInput {
  messageId: string;
  isFeatured: boolean;
}

export interface MessageModerate extends ProviderInput {
  messageId: string;
  isBanned: boolean;
  reason?: string;
}

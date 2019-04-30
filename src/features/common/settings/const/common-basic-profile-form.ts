import { MAX_ABOUT_LENGTH, MAX_USERNAME_LENGTH } from '@bit/garlictech.angular-features.common.gtrack-interfaces';
import { EmojiField, TextboxField } from '@bit/garlictech.angular-features.web.forms-primeng';

export const commonBasicProfileFormDescriptor = {
  // profilePicture: new FileField({
  //   required: false,
  //   fileId: 'basic-profile-picture',
  //   uploadOptions: <any>{}
  // }),
  // coverPicture: new FileField({
  //   required: false,
  //   fileId: 'basic-profile-cover-picture',
  //   uploadOptions: <any>{}
  // }),
  userName: new TextboxField({
    required: true,
    maxLength: MAX_USERNAME_LENGTH
  }),
  about: new EmojiField({ required: false, maxLength: MAX_ABOUT_LENGTH })
};

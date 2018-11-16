import { TextboxField, EmojiField } from 'subrepos/gtrack-common-web/forms';

import { MAX_USERNAME_LENGTH, MAX_ABOUT_LENGTH } from 'subrepos/provider-client/user-profile/constants';

export const commonBasicProfileFOrmDescriptor = {
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

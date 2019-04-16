import { EmojiField, TextboxField } from '@features/web/forms-primeng';

import { MAX_ABOUT_LENGTH, MAX_USERNAME_LENGTH } from '@features/common/gtrack-interfaces/user-profile/constants';

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

import { EPoiTypes, ETextualDescriptionType } from 'subrepos/provider-client';

export const EXPECTED_FLAT_KEY_VALUES = {
  conflicts: {
    coords: [
      '[47.6795337, 19.0668602, 0, undefined,  undefined]',
      '[47.660011, 19.077554, 0, undefined,  undefined]'
    ],
    'description.en_US.title': ['Szentendre', 'Hotel Róz Kkt'],
    'google.id': [
      'ChIJcWajYAPWQUcRIBweDCnEAAQ',
      'ChIJJ0b974rWQUcRWtjVwb7NsRw'
    ]
  },
  unique: {
    'description.en_US.type': ETextualDescriptionType.markdown,
    objectTypes: [EPoiTypes.google],
    types: [
      'city',
      'political',
      'lodging',
      'restaurant',
      'point_of_interest',
      'food',
      'establishment'
    ]
  }
};

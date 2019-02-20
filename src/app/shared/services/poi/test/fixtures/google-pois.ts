import * as _ from 'lodash';
import { EPoiTypes, ETextualDescriptionType } from 'subrepos/provider-client';

// tslint:disable:max-line-length

export const GOOGLE_POI_RESPONSE = {
  html_attributions: [],
  results: [
    {
      geometry: {
        location: {
          lat: 47.6795337,
          lng: 19.0668602
        },
        viewport: {
          northeast: {
            lat: 47.7283769,
            lng: 19.0910101
          },
          southwest: {
            lat: 47.625712,
            lng: 18.9749451
          }
        }
      },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png',
      id: '4bb9564d9b2a45cc230f56b84ddaf903ff5d9669',
      name: 'Szentendre',
      photos: [
        {
          height: 2848,
          html_attributions: [
            "<a href='https://maps.google.com/maps/contrib/105493902110171787684/photos'>nadav ezra</a>"
          ],
          photo_reference:
            'CmRaAAAAlf4oRzMHkNuJf1872OVYbJT2nuZbYUV7jNFxtLrxCogFxK6Brex_4GKHesxQBv1tOMUqKM41-ElMff1VvAYlLsQbI-dAw6PdrlmWLVYUclIVGH8OcIv40DrCp-Wp2k6lEhDgmEwAkAGBEElv-_0AEre8GhQkpDBIlCKrC6ny7HTNCouG5Ba5kg',
          width: 4288
        }
      ],
      place_id: 'ChIJcWajYAPWQUcRIBweDCnEAAQ',
      reference: 'ChIJcWajYAPWQUcRIBweDCnEAAQ',
      scope: 'GOOGLE',
      types: ['locality', 'political'],
      vicinity: 'Szentendre'
    },
    {
      geometry: {
        location: {
          lat: 47.660011,
          lng: 19.077554
        },
        viewport: {
          northeast: {
            lat: 47.6612130802915,
            lng: 19.0784254302915
          },
          southwest: {
            lat: 47.6585151197085,
            lng: 19.0757274697085
          }
        }
      },
      icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/lodging-71.png',
      id: '74fe896eb90519f559f13324c6a44cb9c61b04a2',
      name: 'Hotel Róz Kkt',
      opening_hours: {
        open_now: false
      },
      photos: [
        {
          height: 3120,
          html_attributions: [
            "<a href='https://maps.google.com/maps/contrib/111477983553884093276/photos'>Pavel Kricensky</a>"
          ],
          photo_reference:
            'CmRaAAAAfjNeFHFxi5gSAR-fTzLy3QlgYYuMaB1mVcuDlnZEIzxHDCINi3RUhYknoQShmIWGit6-NGHQ-85uQmBOqqpIEeAHSu1QQqw0UB3KNx8YJHuMvoEPd6sB2Ztu4apwQbt9EhB_XYnz48FuPO8lp661Tl_UGhSq8XeRqWkDYuKAvyx1ot8D4qhKwQ',
          width: 4160
        }
      ],
      place_id: 'ChIJJ0b974rWQUcRWtjVwb7NsRw',
      plus_code: {
        compound_code: 'M36H+22 Szentendre, Magyarország',
        global_code: '8FVXM36H+22'
      },
      rating: 4.2,
      reference: 'ChIJJ0b974rWQUcRWtjVwb7NsRw',
      scope: 'GOOGLE',
      types: ['lodging', 'restaurant', 'point_of_interest', 'food', 'establishment'],
      vicinity: 'Szentendre, Pannónia utca 6'
    }
  ],
  status: 'OK'
};

export const GOOGLE_POIS = [
  {
    id: '1',
    lat: GOOGLE_POI_RESPONSE.results[0].geometry.location.lat,
    lon: GOOGLE_POI_RESPONSE.results[0].geometry.location.lng,
    elevation: 0,
    description: {
      en_US: {
        title: GOOGLE_POI_RESPONSE.results[0].name,
        summary: '',
        fullDescription: '',
        type: ETextualDescriptionType.markdown
      }
    },
    types: ['city', 'political'],
    objectTypes: [EPoiTypes.google],
    google: {
      id: GOOGLE_POI_RESPONSE.results[0].place_id
    },
    selected: false
  },
  {
    id: '2',
    lat: GOOGLE_POI_RESPONSE.results[1].geometry.location.lat,
    lon: GOOGLE_POI_RESPONSE.results[1].geometry.location.lng,
    elevation: 0,
    description: {
      en_US: {
        title: GOOGLE_POI_RESPONSE.results[1].name,
        summary: '',
        fullDescription: '',
        type: ETextualDescriptionType.markdown
      }
    },
    types: ['lodging', 'restaurant', 'point_of_interest', 'food', 'establishment'],
    objectTypes: [EPoiTypes.google],
    google: {
      id: GOOGLE_POI_RESPONSE.results[1].place_id
    },
    selected: false
  }
];

export const DETAILED_GOOGLE_POI = _.merge(_.omit(_.cloneDeep(GOOGLE_POIS[0]), 'google'), {
  id: GOOGLE_POIS[0].google.id,
  formatted_address: 'mockAddress',
  international_phone_number: 'mockNumber',
  opening_hours: 'mockOpeningHours',
  photos: [
    {
      html_attributions: ['photoTitle'],
      width: 2000,
      height: 1000,
      photo_reference: 'mockReference'
    }
  ]
});

// tslint:enable:max-line-length

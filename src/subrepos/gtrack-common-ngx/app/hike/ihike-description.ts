export interface IHikeDescriptionData {
  full: string;
  name: string;
  summary: string;
};

export interface IHikeDescription {
  [locale: string]: IHikeDescriptionData;
};

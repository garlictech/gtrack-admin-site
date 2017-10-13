export interface IMockHikeElement {
  id?: string;
  title?: {
    [lng: string]: string;
  };
  description?: {
    [lng: string]: string;
  };
  summary?: {
    [lng: string]: string;
  };
}

export interface PersonalApiKey {
  uuid: string;
  prefix: string;
  scope: string;
  name: string;
  expiry_date: string;
  created: string;
  revoked: boolean;
  last_used: string;
}

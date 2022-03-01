import { Organisation } from "./organisationType";

export interface User {
  uuid: string;
  url: string;
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  roles: string[];
}

export interface UserInvitation {
  uuid: string;
  id: number;
  url: string;
  status: string;
  user: string;
  email: string;
  created_at: string;
  email_sent_at: string;
  modified_at: string;
  created_by: string;
  permissions: {
    organisation: Organisation;
    roles: string[];
  }[];
}

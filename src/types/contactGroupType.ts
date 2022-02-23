import { Organisation } from "./organisationType";

export interface Contact {
  id: number,
  url: string,
  first_name: string,
  last_name: string,
  email: string,
  phone_number: string,
  user?: { // linked Django user
    first_name: string,
    last_name: string,
    email: string,
    phone_number: string
  }
}

export interface ContactGroup {
  id: number,
  url: string,
  name: string,
  organisation: Organisation,
  created: string,
  last_modified: string,
  contacts: Contact[]
}
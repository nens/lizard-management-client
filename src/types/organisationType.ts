export interface Organisation {
  name: string,
  uuid: string,
  url: string,
}

export interface OrganisationWithRoles extends Organisation {
  roles: UserRole[]
}

type UserRole = "admin" | "manager" | "supplier" | "user";
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      platformRole: string
      entityId: string
      entity: any
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    platformRole: string
    entityId: string
    entity: any
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    platformRole: string
    entityId: string
    entity: any
  }
}

interface User {
  first_name: string
  last_name: string
  email: string
  address?: string | null
  profile_picture?: string | null
  firebase_id: string
}

export { User }

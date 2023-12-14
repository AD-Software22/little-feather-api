import admin = require('firebase-admin')

interface Baby {
  name: string
  gender: string
  profile_picture?: string | null
  place_of_birth?: string | null
  measurements?: [BabyMeasurement]
  timestamp?: number | null
  date_of_birth?: number | null
}
interface BabyMeasurement {
  weight?: number | null
  height?: number | null
  timestamp?: number | null
}

export { Baby, BabyMeasurement }

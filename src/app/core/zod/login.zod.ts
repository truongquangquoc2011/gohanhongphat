import { numberConstants } from '@/app/configs/consts'
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().min(numberConstants.TWO, {
    message: 'Email is required.'
  }),
  password: z.string().min(numberConstants.SIX, {
    message: 'Incorrect password.'
  })
})

import { z } from 'zod'

export const WinLogSchema = z.object({
  game_id: z.string().uuid({ message: 'game_id must be a valid UUID' }),
  played_at: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'played_at must be in YYYY-MM-DD format' }),
  opponents: z.string().max(500, { message: 'Opponents must be 500 characters or fewer' }).optional(),
})

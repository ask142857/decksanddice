'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { DayPicker } from 'react-day-picker'
import { format, isAfter, startOfDay } from 'date-fns'
import { Loader2, Trophy, Calendar, Users, ChevronDown, Check } from 'lucide-react'
import * as Select from '@radix-ui/react-select'
import { showToast } from '@/lib/toast'
import { WinLogSchema } from '@/lib/wins'
import type { WinFormValues, Game } from '@/types'

const todayDate = startOfDay(new Date())

interface LogWinClientProps {
  games: Game[]
}

export function LogWinClient({ games }: LogWinClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const preselectedGameId = searchParams.get('game_id') ?? ''

  const [selectedDate, setSelectedDate] = useState<Date>(todayDate)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WinFormValues>({
    resolver: zodResolver(WinLogSchema),
    defaultValues: {
      game_id: preselectedGameId,
      played_at: format(todayDate, 'yyyy-MM-dd'),
      opponents: '',
    },
  })

  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    if (isAfter(startOfDay(date), todayDate)) return
    setSelectedDate(date)
    setValue('played_at', format(date, 'yyyy-MM-dd'), { shouldValidate: true })
    setCalendarOpen(false)
  }

  async function onSubmit(values: WinFormValues) {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/wins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: values.game_id,
          played_at: values.played_at,
          opponents: values.opponents ?? undefined,
        }),
      })

      if (res.status === 429) {
        showToast.error("You've already logged 3 wins for this game today")
        return
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message =
          typeof data?.error === 'string'
            ? data.error
            : (data?.error?.message ?? 'Something went wrong — please try again')
        showToast.error(message)
        return
      }

      showToast.success('Win logged! 🎉')
      reset({
        game_id: '',
        played_at: format(todayDate, 'yyyy-MM-dd'),
        opponents: '',
      })
      setSelectedDate(todayDate)
      router.push('/dashboard')
    } catch {
      showToast.error('Request failed — please try again')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto w-full py-8 px-4 md:px-0">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}
          >
            <Trophy size={20} />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Log a Win
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Record your victory at Decks &amp; Dice!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="glass-card p-6 flex flex-col gap-6">

          {/* Game Selector */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="game-select"
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Game <span style={{ color: 'var(--error)' }}>*</span>
            </label>

            <Controller
              control={control}
              name="game_id"
              render={({ field }) => (
                <Select.Root
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <Select.Trigger
                    id="game-select"
                    className="input-field flex items-center justify-between w-full"
                    style={{
                      cursor: 'pointer',
                      color: field.value ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    }}
                    aria-label="Select a game"
                  >
                    <Select.Value placeholder="Choose a game..." />
                    <Select.Icon asChild>
                      <ChevronDown
                        size={16}
                        style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
                      />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content
                      className="z-50 rounded-xl overflow-hidden"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(12px)',
                        minWidth: '220px',
                      }}
                      position="popper"
                      sideOffset={4}
                    >
                      <Select.Viewport className="p-1">
                        {games.length === 0 ? (
                          <div
                            className="px-3 py-2 text-sm"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            No games available
                          </div>
                        ) : (
                          games.map(game => (
                            <Select.Item
                              key={game.id}
                              value={game.id}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm outline-none transition-colors"
                              style={{ cursor: 'pointer', color: 'var(--text-primary)' }}
                            >
                              <Select.ItemText>{game.name}</Select.ItemText>
                              <Select.ItemIndicator className="ml-auto">
                                <Check size={14} style={{ color: 'var(--accent)' }} />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))
                        )}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              )}
            />

            {errors.game_id && (
              <p className="text-xs" style={{ color: 'var(--error)' }}>
                {errors.game_id.message}
              </p>
            )}
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Date Played <span style={{ color: 'var(--error)' }}>*</span>
            </label>

            {/* Hidden field so RHF tracks the value */}
            <input type="hidden" {...register('played_at')} />

            <div className="relative">
              <button
                type="button"
                onClick={() => setCalendarOpen(prev => !prev)}
                className="input-field flex items-center gap-2 w-full text-left"
                style={{ cursor: 'pointer', color: 'var(--text-primary)' }}
                aria-label="Pick a date"
                aria-expanded={calendarOpen}
                aria-haspopup="dialog"
              >
                <Calendar
                  size={16}
                  style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
                />
                <span>{format(selectedDate, 'MMMM d, yyyy')}</span>
              </button>

              {calendarOpen && (
                <div
                  className="absolute z-50 mt-2 rounded-xl p-3"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(12px)',
                    left: 0,
                  }}
                  role="dialog"
                  aria-label="Date picker"
                >
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={{ after: todayDate }}
                    defaultMonth={selectedDate}
                    styles={{
                      root: { fontFamily: 'var(--font-inter), system-ui, sans-serif' },
                    }}
                  />
                </div>
              )}
            </div>

            {errors.played_at && (
              <p className="text-xs" style={{ color: 'var(--error)' }}>
                {errors.played_at.message}
              </p>
            )}
          </div>

          {/* Opponents */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="opponents"
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <Users size={14} style={{ color: 'var(--text-secondary)' }} />
              Opponents
              <span
                className="text-xs font-normal"
                style={{ color: 'var(--text-tertiary)' }}
              >
                (optional)
              </span>
            </label>

            <textarea
              id="opponents"
              {...register('opponents')}
              rows={3}
              placeholder="Who did you beat? (optional) — e.g. Alex, Sam"
              className="input-field resize-none"
            />

            {errors.opponents && (
              <p className="text-xs" style={{ color: 'var(--error)' }}>
                {errors.opponents.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center justify-center gap-2 w-full"
            style={{ minHeight: '44px' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Logging win...</span>
              </>
            ) : (
              <>
                <Trophy size={16} />
                <span>Log Win</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

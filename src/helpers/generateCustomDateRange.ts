import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isSameOrBefore)

type Step = 'day' | 'week' | 'month' | 'year'

interface DateRangeProps {
  range: [string, string]
  baseDate: Date
}

function day({range}: DateRangeProps): string[] {
  const [startStr, endStr] = range
  const start = dayjs(startStr)
  const end = dayjs(endStr)

  const dates: string[] = []
  let current = start

  while (current.isBefore(end) || current.isSame(end)) {
    dates.push(current.format('YYYY-MM-DD'))
    current = current.add(1, 'day')
  }

  return dates
}

function week({range}: DateRangeProps): string[] {
  const [startStr, endStr] = range
  const start = dayjs(startStr)
  const end = dayjs(endStr)

  const dates: string[] = []
  let current = start

  while (current.isBefore(end) || current.isSame(end)) {
    dates.push(current.format('YYYY-MM-DD'))
    current = current.add(1, 'week')
  }

  return dates
}

function month({ range, baseDate }: DateRangeProps) {
  const [startStr, endStr] = range
  const base = dayjs(baseDate)
  const baseDay = base.date()

  const safeDate = (date: dayjs.Dayjs, day: number) => {
    const lastDayOfMonth = date.endOf('month').date()
    return date.date(Math.min(day, lastDayOfMonth))
  }

  let current = safeDate(dayjs(startStr).startOf('day'), baseDay)
  const end = safeDate(dayjs(endStr).startOf('day'), baseDay)

  if (current.isBefore(dayjs(startStr).startOf('day'))) {
    current = safeDate(current.add(1, 'month'), baseDay)
  }

  const dates: string[] = []

  while (current.isSameOrBefore(end)) {
    dates.push(current.format('YYYY-MM-DD'))
    current = safeDate(current.add(1, 'month'), baseDay)
  }

  return dates
}

function year({ range, baseDate }: DateRangeProps) {
  const [startStr, endStr] = range
  const base = dayjs(baseDate)
  const baseDay = base.date()
  const baseMonth = base.month()

  const safeDate = (date: dayjs.Dayjs, month: number, day: number) => {
    const withMonth = date.month(month)
    const lastDayOfMonth = withMonth.endOf('month').date()
    return withMonth.date(Math.min(day, lastDayOfMonth))
  }

  let current = safeDate(dayjs(startStr).startOf('day'), baseMonth, baseDay)
  const end = safeDate(dayjs(endStr).startOf('day'), baseMonth, baseDay)

  if (current.isBefore(dayjs(startStr).startOf('day'))) {
    current = safeDate(current.add(1, 'year'), baseMonth, baseDay)
  }

  const dates: string[] = []

  while (current.isSameOrBefore(end)) {
    dates.push(current.format('YYYY-MM-DD'))
    current = safeDate(current.add(1, 'year'), baseMonth, baseDay)
  }

  return dates
}

export const generateCustomDateRange = {
  day,
  week,
  month,
  year
}
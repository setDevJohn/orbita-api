import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

type Step = 'day' | 'week' | 'month' | 'year'

export function generateCustomDateRange(range: [string, string], step: Step): string[] {
  const [startStr, endStr] = range
  const start = dayjs(startStr)
  const end = dayjs(endStr)

  const dates: string[] = []
  let current = start

  while (current.isBefore(end) || current.isSame(end)) {
    dates.push(current.format('YYYY-MM-DD'))

    switch (step) {
      case 'day':
        current = current.add(1, 'day')
        break
      case 'week':
        current = current.add(1, 'week')
        break
      case 'month':
        current = current.add(1, 'month')
        break
      case 'year':
        current = current.add(1, 'year')
        break
    }
  }

  return dates
}
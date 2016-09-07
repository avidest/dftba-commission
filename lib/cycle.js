import moment from 'moment'
import 'moment-range'

const defaults = {
  cycleTime: moment()
}

const TIME_ZONE = '-07:00'

export function getCurrentCycle(opts = {}) {
  let o = {...defaults, ...opts}

  let today = moment()
  let cycleTime = moment(Date.parse(o.cycleTime))
  let currentMonthEndDate = moment(cycleTime)
  let currentMonthStartDate = moment(cycleTime).subtract(1, 'month').add(1, 'second')
  let cycle = moment.range(currentMonthStartDate, currentMonthEndDate)

  if (!cycle.contains(today, true)) {
    cycle.start.add(1, 'month')
    cycle.end.add(1, 'month')
  }

  return cycle
}

export function getLastNCycles(n, opts = {}) {
  let current = getCurrentCycle(opts)
  let cycles = [current]
  while (cycles.length < n) {
    let curr = cycles[cycles.length - 1]
    let end = moment(curr.start).subtract(1, 'second')
    let start = moment(end).subtract(1, 'month').add(1, 'second')
    let cycle = moment.range(start, end)
    cycles.push(cycle)
  }
  return cycles
}
import moment from 'moment'

const defaults = {
  cutoffDate: moment().year(1975).month(1).date(18).minutes(59).hours(23).seconds(59)
}

export function getCurrentCycle(opts = {}) {
  let o = {...defaults, ...opts}
  let today = moment()
  let currentPeriodEndDate = moment(o.cutoffDate).month(today.month()).year(today.year())

  let sameOrBefore = today.isSameOrBefore(currentPeriodEndDate)
  currentPeriodEndDate = moment(currentPeriodEndDate)
                            .month(currentPeriodEndDate.month() + (sameOrBefore ? 0 : 1))

  let currentPeriodStartDate = moment(currentPeriodEndDate).month(currentPeriodEndDate.month() - 1)
  return [
    currentPeriodStartDate,
    currentPeriodEndDate
  ]
}

export function getLastNCycles(n, opts = {}) {
  let current = getCurrentCycle(opts)
  let cycles = [current]
  while (cycles.length < n) {
    let curr = cycles[cycles.length - 1]
    let end = moment(curr[0])
    let start = moment(curr[0]).month(curr[0].month() - 1)
    cycles.push([ start, end ])
  }
  return cycles
}
import * as moment from 'moment'

// const iso8601Duration = "PT16H30M"
// -> { _data: { days: 0, hours: 16, milliseconds: 0, minutes: 30, months: 0, seconds: 0, years: 0} ... 

export function duration(iso8601Duration: string, startDate: number){
    const shift = moment.duration(iso8601Duration).asMilliseconds()

    const adjustedTimeAsMs = startDate + shift;
    // console.log("startDate: " + startDate + "=" + new Date(startDate))
    // console.log("shift: " + shift)
    // console.log("adjustedTimeAsMs: " + adjustedTimeAsMs + " = " + new Date(adjustedTimeAsMs))
    return adjustedTimeAsMs
}

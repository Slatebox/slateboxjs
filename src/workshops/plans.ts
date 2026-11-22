// slateboxjs/workshops/plans: the plans (a launch plan and a hiring plan) on one kernel, with their time
// rules (dragology final.md D2, D3): real dates, working days, a hard or soft line, overlap, snap,
// freezes, push or stop, locks, and the hiring plan's runway. It is its own chunk, loaded with the rules
// (a server) or a plan's kit (a browser); loading it plugs both plans into the one gate.
export * from './calendar'
export * from './launchPlan'
export * from './timeRules'
export * from './hiringPlan'

// slateboxjs/workshops/rules: the rules of a launch plan, a sales pipeline and a budget, for a
// server (or any host that reads these boards without drawing them). Importing it plugs all three
// into the one gate in slateboxjs/workshops/model: validateWorkshop, applyWorkshopEdits and every
// move then decide these boards here exactly as a browser does once slateboxjs/boards has loaded
// them with the kits. It is the same code: the browser's kits import these modules.
export * from './launchPlan'
export * from './pipeline'
export * from './budget'
export * from './numbers'

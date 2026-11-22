// slateboxjs/workshops/rules: the rules of a launch plan, a hiring plan, a sales pipeline and a budget, for a
// server (or any host that reads these boards without drawing them). Importing it plugs all three
// into the one gate in slateboxjs/workshops/model: validateWorkshop, applyWorkshopEdits and every
// move then decide these boards here exactly as a browser does once slateboxjs/boards has loaded
// them with the kits. It is the same code: the browser's kits import these modules. The boards the library adds
// (catalogSamples) are their own chunk: slateboxjs/workshops/samples.
export * from './plans'
export * from './nest'
export * from './nestPlus'
export * from './pipeline'
export * from './budget'
export * from './numbers'
export * from './behaviourSaves'
import { goLiveSample, hiringPlanSample, launchPlanSample } from './plans'
import { samplePipeline } from './pipeline'
import { sampleBudget } from './budget'
/** The plans', pipeline's and budget's boards the library adds; slateboxjs/workshops/samples adds the nested boards' (catalogSamples). */
export const planSamples = { 'launch-plan': launchPlanSample, 'go-live': goLiveSample, 'hiring-plan': hiringPlanSample, pipeline: samplePipeline, budget: sampleBudget }

// slateboxjs/workshops/rules: the rules of a launch plan, a hiring plan, a sales pipeline and a budget, for a
// server (or any host that reads these boards without drawing them). Importing it plugs all three
// into the one gate in slateboxjs/workshops/model: validateWorkshop, applyWorkshopEdits and every
// move then decide these boards here exactly as a browser does once slateboxjs/boards has loaded
// them with the kits. It is the same code: the browser's kits import these modules.
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
import { breakDownSample, discoveryTreeSample, incidentReviewSample, sortEvidenceSample } from './nest'
import { goalsSample, impactEffortSample, reorgSample } from './nestPlus'
/** The boards the library's business entries add (catalogPreset's samples), each made fresh, dated from the next Monday. */
export const catalogSamples = { 'launch-plan': launchPlanSample, 'go-live': goLiveSample, 'hiring-plan': hiringPlanSample, pipeline: samplePipeline, budget: sampleBudget,
  'sort-evidence': sortEvidenceSample, 'discovery-tree': discoveryTreeSample, 'break-down': breakDownSample, 'incident-review': incidentReviewSample,
  'impact-effort': impactEffortSample, reorg: reorgSample, goals: goalsSample }

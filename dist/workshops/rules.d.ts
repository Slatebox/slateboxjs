export * from './plans';
export * from './nest';
export * from './pipeline';
export * from './budget';
export * from './numbers';
export * from './behaviourSaves';
import { goLiveSample, hiringPlanSample, launchPlanSample } from './plans';
import { samplePipeline } from './pipeline';
import { sampleBudget } from './budget';
import { breakDownSample, discoveryTreeSample, incidentReviewSample, sortEvidenceSample } from './nest';
/** The boards the library's business entries add (catalogPreset's samples), each made fresh, dated from the next Monday. */
export declare const catalogSamples: {
    'launch-plan': typeof launchPlanSample;
    'go-live': typeof goLiveSample;
    'hiring-plan': typeof hiringPlanSample;
    pipeline: typeof samplePipeline;
    budget: typeof sampleBudget;
    'sort-evidence': typeof sortEvidenceSample;
    'discovery-tree': typeof discoveryTreeSample;
    'break-down': typeof breakDownSample;
    'incident-review': typeof incidentReviewSample;
};

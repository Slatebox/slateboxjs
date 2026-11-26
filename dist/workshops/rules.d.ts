export * from './plans';
export * from './nest';
export * from './nestPlus';
export * from './grid';
export * from './pipeline';
export * from './budget';
export * from './numbers';
export * from './behaviourSaves';
import { goLiveSample, hiringPlanSample, launchPlanSample } from './plans';
import { samplePipeline } from './pipeline';
import { sampleBudget } from './budget';
/** The plans', pipeline's and budget's boards the library adds; slateboxjs/workshops/samples adds the nested boards' (catalogSamples). */
export declare const planSamples: {
    'launch-plan': typeof launchPlanSample;
    'go-live': typeof goLiveSample;
    'hiring-plan': typeof hiringPlanSample;
    pipeline: typeof samplePipeline;
    budget: typeof sampleBudget;
};

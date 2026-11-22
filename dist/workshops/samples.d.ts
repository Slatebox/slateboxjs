import type { Workshop } from './model';
type Board = Workshop;
/**
 * Sort the evidence: three piles of what customers said, two notes not sorted yet, ARR per customer. Its rules:
 * notes sit in piles, one level deep, piles rank by how many customers, a note let go in empty space starts a pile.
 */
export declare function sortEvidenceSample(): Board;
/** Discovery tree: an outcome, the opportunities under it and the solutions under those; two ideas parked. */
export declare function discoveryTreeSample(): Board;
/** Break down a problem (an issue tree): a problem, its causes, causes under those, and actions under causes (warnings, never refusals). */
export declare function breakDownSample(): Board;
/** Incident review: the same breakdown for an outage: what caused it, what caused that, and what to fix. */
export declare function incidentReviewSample(): Board;
/** Impact × effort: what to work on next, scored; Do now already holds its three. */
export declare function impactEffortSample(): Board;
/** Reorg & hiring sandbox: who reports to whom, open roles, a contractor; spans, open roles and designers as rules. */
export declare function reorgSample(): Board;
/** Goals & owners: objectives, key results and initiatives, each owned by a team; a key result owned outside its objective's team is flagged. */
export declare function goalsSample(): Board;
/** The boards the library's business entries add (catalogPreset's samples), each made fresh, dated from the next Monday. */
export declare const catalogSamples: {
    'sort-evidence': typeof sortEvidenceSample;
    'discovery-tree': typeof discoveryTreeSample;
    'break-down': typeof breakDownSample;
    'incident-review': typeof incidentReviewSample;
    'impact-effort': typeof impactEffortSample;
    reorg: typeof reorgSample;
    goals: typeof goalsSample;
    'launch-plan': typeof import("./launchPlan").launchPlanSample;
    'go-live': typeof import("./launchPlan").goLiveSample;
    'hiring-plan': typeof import("./hiringPlan").hiringPlanSample;
    pipeline: typeof import("./pipeline").samplePipeline;
    budget: typeof import("./budget").sampleBudget;
};
export {};

/**
 * slateboxjs/operations: the canvas operation contract, free of the DOM.
 * The app server, the browser's live applier (core/SlateOperations) and the
 * published agent package all use it, so a plan means the same thing on each.
 */
export {
  SLATE_OPERATION_KINDS,
  OPERATION_FIELDS,
  LIMITS,
  DEFAULT_FONTS,
  OperationPlanError,
  contractLists,
  contractLimits,
} from "./contract";
export type {
  ContractOptions,
  Limits,
  OperationReport,
  SlateOperation,
  SlateOperationKind,
  SlateOperationPlan,
  SlateOperationReport,
  SlateOperationValidation,
} from "./contract";
export { validatePlan } from "./validate";
export type { ValidateOptions } from "./validate";
export { applyPlanToJSON } from "./apply-json";
export type { ApplyOptions, ApplyResult } from "./apply-json";
export { summarizeSlate } from "./summarize";
export type { SlateSummary } from "./summarize";
export { toStoredSlate } from "./stored";
export type { StoredNode, StoredSlate } from "./stored";
export {
  describeOperations,
  slateOperationPlanSchema,
  SLATE_OPERATION_TOOL,
  operationPlanRetryPrompt,
  naturalOperationFallback,
} from "./describe";
export { NODE_KEYS, NODE_STYLE_KEYS, BORDER_STYLES } from "./keys/node";
export { CONNECTOR_KEYS, CONNECTOR_STYLE_KEYS } from "./keys/connector";
export { SLATE_KEYS } from "./keys/slate";
export type { Background } from "./keys/slate";
export type { NodeSelector } from "./keys/selector";

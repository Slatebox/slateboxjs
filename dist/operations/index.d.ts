/**
 * slateboxjs/operations: the canvas operation contract, free of the DOM.
 * The app server, the browser's live applier (core/SlateOperations) and the
 * published agent package all use it, so a plan means the same thing on each.
 */
export { SLATE_OPERATION_KINDS, OPERATION_FIELDS, LIMITS, LAYOUTS, PRESETS, DEFAULT_FONTS, OperationPlanError, contractLists, contractLimits, } from "./contract";
export type { ContractOptions, Limits, OperationReport, SlateOperation, CustomShapeValue, SlateOperationKind, SlateOperationPlan, SlateOperationReport, SlateOperationValidation, } from "./contract";
export { validatePlan } from "./validate";
export type { ValidateOptions } from "./validate";
export { applyPlanToJSON } from "./apply-json";
export type { ApplyOptions, ApplyResult } from "./apply-json";
export { summarizeSlate } from "./summarize";
export { readSlate, readNote, readConnector, toSlateDocument, NOTE_READ_KEYS, READ_LIMITS, DOCUMENT_OPTION_KEYS } from "./read";
export type { ReadSelection, SlateRead } from "./read";
export type { SlateSummary } from "./summarize";
export { toStoredSlate } from "./stored";
export type { StoredNode, StoredSlate } from "./stored";
export { describeOperations, slateOperationPlanSchema, SLATE_OPERATION_TOOL, operationPlanRetryPrompt, naturalOperationFallback, } from "./describe";
export { NODE_KEYS, NODE_INTENT_KEYS, NODE_STYLE_KEYS, BORDER_STYLES, EFFECTS } from "./keys/node";
export { alignPositions, distributePositions, rotatedBounds, tidyPositions, treePositions } from "./layout";
export type { AlignMode, DistributeAxis, LayoutBox, Position } from "./layout";
export { CONNECTOR_KEYS, CONNECTOR_STYLE_KEYS } from "./keys/connector";
export { SLATE_KEYS, backgroundOf } from "./keys/slate";
export type { Background } from "./keys/slate";
export type { NodeSelector } from "./keys/selector";
export { MEDIA_PROVIDERS, MEDIA_HOST_NAMES, MEDIA_FRAME_ORIGINS, MEDIA_NOTE_SIZE, MEDIA_LIMITS, parseMediaUrl, isMediaUrl, parseStart, mediaEmbedUrl, readMediaValue, readMedia, mediaLabel, } from "./media";
export type { MediaValue, MediaProvider } from "./media";

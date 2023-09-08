import {join} from "path";

export {WORKSPACE_VALIDATIONS} from "./workspace-validation/validate-workspace/workspace-validations";
export {WorkspaceValidationResult, WorkspaceValidation, ValidationId} from "./types/validation.types";
export const validatorsFolder = join(__dirname, 'validators')

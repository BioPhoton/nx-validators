/* eslint-disable no-console */
import type { ResultStatus, WorkspaceValidationResult } from '../../types/validation.types';

const TAB = '    ';

export type LogType = 'success' | 'warning' | 'info' | 'failure';

const DEFAULT_COLOR = '\x1b[0m';
const BLACK_COLOR = '\x1b[30m';

const SUCCESS_ICON = '\u2714';
const FAILURE_ICON = '\u2716';

const FAILURE_FG_COLOR = '\x1b[31m';
const SUCCESS_FG_COLOR = '\x1b[32m';

const FAILURE_BG_COLOR = '\x1b[41m';
const SUCCESS_BG_COLOR = '\x1b[42m';
const SKIP_BG_COLOR = '\x1b[47m';

type LogConfig = {
    label: string;
    messageColor?: string;
    labelTextColor?: string;
    labelBackgroundColor?: string;
    icon?: string;
};

const reportLog = (message: string, { messageColor, label, labelTextColor, labelBackgroundColor, icon }: LogConfig, indentation: string = '') => {
    console.log(indentation, labelTextColor || '' + labelBackgroundColor, icon, label, DEFAULT_COLOR + messageColor, message, DEFAULT_COLOR);
};

const configMap: Record<ResultStatus, LogConfig> = {
    success: {
        messageColor: SUCCESS_FG_COLOR,
        label: 'SUCCESS',
        labelBackgroundColor: SUCCESS_BG_COLOR,
        icon: SUCCESS_ICON,
    },
    failed: {
        messageColor: FAILURE_FG_COLOR,
        label: 'FAILED',
        labelBackgroundColor: FAILURE_BG_COLOR,
        icon: FAILURE_ICON,
    },
    skip: {
        label: 'SKIP',
        labelBackgroundColor: SKIP_BG_COLOR,
        labelTextColor: BLACK_COLOR,
    },
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export default function reportToConsole({ validationResults }: WorkspaceValidationResult): void {
    console.log('\n');
    Object.values(validationResults).forEach(({ name, validatorResults, status }) => {
        // log validation name and status
        reportLog(name, configMap[status]);
        Object.entries(validatorResults).forEach(([validator, { documentation, data, status: validatorStatus }]) => {
            // log validator name
            console.log(TAB, capitalize(validator));
            (data || []).forEach(({ expected, status: logStatus, log }) => {
                // log status and expected description for each data log
                reportLog(expected, configMap[logStatus], TAB + TAB);
                if (log) {
                    // log extra data
                    const logWithIndent = log.replaceAll('\n', '\n' + TAB + TAB);
                    console.log(FAILURE_FG_COLOR, TAB + TAB + logWithIndent, DEFAULT_COLOR);
                }
            });
            if (validatorStatus === 'failed') {
                // log documentation link
                console.log(FAILURE_FG_COLOR, TAB + 'Please see the docs to fix the failed validator: \n', TAB + documentation, DEFAULT_COLOR, '\n');
            }
        });
        console.log('\n');
    });
}

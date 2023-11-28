/* eslint-disable no-console */
import { ReportArgs } from '../../types/reports.types';
import type { ResultStatus } from '../../types/validation.types';

const TAB = '    ';

const DEFAULT_COLOR = '\x1b[0m';
const BLACK_COLOR = '\x1b[30m';
const INFO_COLOR = '\x1b[34m';

const SUCCESS_ICON = '\u2714';
const FAILURE_ICON = '\u2716';
const INFO_ICON = '\u2139';

const FAILURE_FG_COLOR = '\x1b[31m';
const SUCCESS_FG_COLOR = '\x1b[32m';

const FAILURE_BG_COLOR = '\x1b[41m';
const SUCCESS_BG_COLOR = '\x1b[42m';
const SKIP_BG_COLOR = '\x1b[47m';
const INFO_BG_COLOR = '\x1b[44m';

type LogConfig = {
    label: string;
    messageColor?: string;
    labelTextColor?: string;
    labelBackgroundColor?: string;
    icon?: string;
};

const levelMap = [
    {
        name: 'WORKSPACE VALIDATION',
        indentation: '',
    },
    {
        name: 'VALIDATION',
        indentation: '',
    },
    {
        name: 'VALIDATOR',
        indentation: TAB,
    },
    {
        name: 'EXPECT',
        indentation: TAB + TAB,
    },
];

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
    info: {
        messageColor: INFO_COLOR,
        label: 'INFO',
        labelBackgroundColor: INFO_BG_COLOR,
        icon: INFO_ICON,
    },
};

const reportLog = (level: number, status: ResultStatus, message: string) => {
    const { messageColor, label, labelTextColor, labelBackgroundColor, icon }: LogConfig = configMap[status];
    const { indentation, name } = levelMap[level];
    console.log(
        indentation,
        labelTextColor ?? '' + labelBackgroundColor,
        icon,
        name,
        label,
        DEFAULT_COLOR + (messageColor ?? ''),
        message,
        DEFAULT_COLOR,
    );
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const shouldShowPassed = (showPassed: boolean, status: ResultStatus) => showPassed || (!showPassed && status !== 'success' && status !== 'info');

export default function reportToConsole({ showPassed, result: workspaceValidationResult, hasFinished }: ReportArgs): void {
    Object.values(workspaceValidationResult.validationResults)
        .filter(({ status }) => shouldShowPassed(showPassed, status))
        .forEach(({ name, validatorResults, status }) => {
            // log validation name and status
            reportLog(1, status, name);
            Object.entries(validatorResults)
                .filter(([, { status }]) => shouldShowPassed(showPassed, status))
                .forEach(([validator, { documentation, data, status: validatorStatus }]) => {
                    // log validator name
                    reportLog(2, validatorStatus, capitalize(validator));
                    (data || []).forEach(({ expected, status: logStatus, log }) => {
                        // log status and expected description for each data log
                        if (shouldShowPassed(showPassed, logStatus)) {
                            reportLog(3, logStatus, expected);
                        }
                        if (log) {
                            // log extra data
                            const logWithIndent = log.replaceAll('\n', '\n' + TAB + TAB);
                            console.log(FAILURE_FG_COLOR, TAB + TAB + logWithIndent, DEFAULT_COLOR);
                        }
                    });
                    if (validatorStatus === 'failed') {
                        // log documentation link
                        console.log(
                            FAILURE_FG_COLOR,
                            TAB + 'Please see the docs to fix the failed validator: \n',
                            TAB + documentation,
                            DEFAULT_COLOR,
                            '\n',
                        );
                    }
                    console.log('\n');
                });
        });
    if (hasFinished) {
        console.log('-----------------------------------------------------------------------');
        reportLog(0, workspaceValidationResult.status, '');
        console.log(TAB, 'Success:', workspaceValidationResult.total.success);
        console.log(TAB, 'Failed:', workspaceValidationResult.total.failed);
        console.log(TAB, 'Skip:', workspaceValidationResult.total.skip);
        console.log('\n');
    }
}

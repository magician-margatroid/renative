/* eslint-disable import/no-cycle */
import open from 'better-opn';
import {
    logErrorPlatform,
    waitForWebpack,
} from '../../common';
import { configureGenericPlatform } from '../../platformTools';
import { configureGenericProject } from '../../projectTools';
import { logTask, logError } from '../../systemTools/logger';
import {
    MACOS,
    WINDOWS,
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG, TASK_CONFIGURE
} from '../../constants';
import {
    runElectron,
    buildElectron,
    runElectronDevServer,
    configureElectronProject,
    exportElectron
} from '../../platformTools/electron';
import { executeTask as _executeTask } from '..';

const TASKS = {};

export const _taskConfigure = async (c, parentTask, originTask) => {
    logTask('_taskConfigure', `parent:${parentTask} origin:${originTask}`);

    await configureGenericPlatform(c);
    await configureGenericProject(c);

    switch (c.platform) {
        case MACOS:
        case WINDOWS:
            return configureElectronProject(c);
        default:
            return logErrorPlatform(c);
    }
};
TASKS[TASK_CONFIGURE] = _taskConfigure;

export const _taskStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('_taskStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForWebpack(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    await _executeTask(c, TASK_CONFIGURE, TASK_START, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return runElectronDevServer(c, platform, port);
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_START] = _taskStart;

const _taskRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('_taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await _executeTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return runElectron(c, platform, port);
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_RUN] = _taskRun;

const _taskPackage = async (c, parentTask, originTask) => {
    logTask('_taskPackage', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    switch (platform) {
        default:
            logErrorPlatform(c, platform);
            return false;
    }
};
TASKS[TASK_PACKAGE] = _taskPackage;

const _taskExport = async (c, parentTask, originTask) => {
    logTask('_taskExport', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return exportElectron(c, platform);
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_EXPORT] = _taskExport;

const _taskBuild = async (c, parentTask, originTask) => {
    logTask('_taskBuild', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    switch (platform) {
        case MACOS:
        case WINDOWS:
            await buildElectron(c, platform);
            return;
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_BUILD] = _taskBuild;

const _taskDeploy = async (c, parentTask, originTask) => {
    logTask('_taskDeploy', `parent:${parentTask}`);

    await _executeTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    // Deploy simply trggets hook
    return true;
};
TASKS[TASK_DEPLOY] = _taskDeploy;

const _taskDebug = async (c) => {
    logTask(`_taskDebug:${c.platform}`);
    const { platform } = c;

    switch (platform) {
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_DEBUG] = _taskDebug;

export const _taskLog = async (c) => {
    logTask(`_taskLog:${c.platform}`);
    switch (c.platform) {
        default:
            logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_LOG] = _taskLog;

const executeTask = async (c, task, parentTask, originTask) => TASKS[task](c, parentTask, originTask);

const applyTemplate = async () => true;

export default {
    executeTask,
    applyTemplate
};

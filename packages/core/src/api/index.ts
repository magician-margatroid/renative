import {
    DoResolveFn,
    GetConfigPropFn,
    RnvApi,
    RnvApiLogger,
    RnvApiPrompt,
    RnvApiSpinner,
    RnvContextAnalytics,
} from './types';
import { generateApiDefaults } from './defaults';
import { getApi } from './provider';

global.RNV_API = generateApiDefaults();

export const createRnvApi = (_api?: {
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    analytics: RnvContextAnalytics;
    logger: RnvApiLogger;
    getConfigProp: GetConfigPropFn;
    doResolve: DoResolveFn;
}) => {
    const api: RnvApi = generateApiDefaults();

    api.spinner = _api?.spinner || api.spinner;
    api.prompt = _api?.prompt || api.prompt;
    api.analytics = _api?.analytics || api.analytics;
    api.logger = _api?.logger || api.logger;

    // api.fsExistsSync = fsExistsSync;
    // api.fsReadFileSync = fsReadFileSync;
    // api.fsReaddirSync = fsReaddirSync;
    // api.fsWriteFileSync = fsWriteFileSync;
    // api.path = path;

    global.RNV_API = api;
};

export const inquirerPrompt: RnvApiPrompt['inquirerPrompt'] = (opts) => {
    return getApi().prompt.inquirerPrompt(opts);
};

export const inquirerSeparator: RnvApiPrompt['inquirerSeparator'] = () => {
    return getApi().prompt.inquirerSeparator();
};

export const generateOptions: RnvApiPrompt['generateOptions'] = (inputData, isMultiChoice, mapping, renderMethod) => {
    return getApi().prompt.generateOptions(inputData, isMultiChoice, mapping, renderMethod);
};

export const pressAnyKeyToContinue: RnvApiPrompt['pressAnyKeyToContinue'] = () => {
    return getApi().prompt.pressAnyKeyToContinue();
};

import { z } from 'zod';
import { PlatformCommon } from './common/configPlatformCommon';
import { PlatformAndroid } from './android/configPlatformAndroid';
import { PlatformiOS } from './ios/configPlatformiOS';
import { PlatformWeb } from './web/configPlatformWeb';
import { PlatformTizen } from './tizen/configPlatformTizen';
import { BuildSchemes } from './configBuildSchemes';

// export const Platform = z
//     .object({
//         buildSchemes: z.optional(BuildSchemes),
//     })
//     .merge(PlatformCommon)
//     .merge(PlatformiOS)
//     .merge(PlatformWeb)
//     .merge(PlatformTizen)
//     .merge(PlatformWebpack)
//     .merge(PlatformElectron)
//     .merge(PlatformWindows);

// export const Platforms = z.record(PlatformsKeys, Platform).describe('Object containing platform configurations');

const Base = z
    .object({
        buildSchemes: z.optional(BuildSchemes),
    })
    .merge(PlatformCommon);

export const Platforms = z
    .object({
        android: z.optional(Base.merge(PlatformAndroid)),
        androidtv: z.optional(Base.merge(PlatformAndroid)),
        androidwear: z.optional(Base.merge(PlatformAndroid)),
        firetv: z.optional(Base.merge(PlatformAndroid)),
        ios: z.optional(Base.merge(PlatformiOS)),
        tvos: z.optional(Base.merge(PlatformiOS)),
        tizen: z.optional(Base.merge(PlatformTizen)),
        webos: z.optional(Base.merge(PlatformWeb)),
        web: z.optional(Base.merge(PlatformWeb)),
        webtv: z.optional(Base.merge(PlatformWeb)),
        chromecast: z.optional(Base.merge(PlatformWeb)),
        kaios: z.optional(Base.merge(PlatformWeb)),
        macos: z.optional(Base.merge(PlatformWeb)),
        linux: z.optional(Base.merge(PlatformWeb)),
        windows: z.optional(Base.merge(PlatformWeb)),
        xbox: z.optional(Base.merge(PlatformWeb)),
    })
    .describe('Object containing platform configurations');

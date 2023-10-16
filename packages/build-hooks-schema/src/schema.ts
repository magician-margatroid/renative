import {
    RootAppSchema,
    RootEngineSchema,
    RootGlobalSchema,
    RootPluginSchema,
    RootPluginTemplatesSchema,
    RootPrivateSchema,
    RootProjectLocalSchema,
    RootProjectSchema,
    RootProjectTemplateSchema,
    getContext,
    logSuccess,
} from '@rnv/core';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

export const generateSchema = async () => {
    _generateSchemaFile({ schema: RootProjectSchema, schemaId: 'rnv.project' });
    _generateSchemaFile({ schema: RootAppSchema, schemaId: 'rnv.app' });
    _generateSchemaFile({ schema: RootProjectLocalSchema, schemaId: 'rnv.local' });
    _generateSchemaFile({ schema: RootEngineSchema, schemaId: 'rnv.engine' });
    _generateSchemaFile({ schema: RootGlobalSchema, schemaId: 'rnv.global' });
    _generateSchemaFile({ schema: RootPluginTemplatesSchema, schemaId: 'rnv.plugins' });
    _generateSchemaFile({ schema: RootProjectTemplateSchema, schemaId: 'rnv.template' });
    _generateSchemaFile({ schema: RootPrivateSchema, schemaId: 'rnv.private' });
    _generateSchemaFile({ schema: RootPluginSchema, schemaId: 'rnv.plugin' });

    logSuccess('Sucessfully exported renative.project.json schema');
};

const _generateSchemaFile = (opts: { schema: z.ZodObject<any>; schemaId: string }) => {
    const { schema, schemaId } = opts;
    const ctx = getContext();
    const jsonSchema: any = zodToJsonSchema(schema, schemaId);
    jsonSchema['$schema'] = 'http://json-schema.org/draft-04/schema#';

    jsonSchema.definitions[schemaId].properties['$schema'] = {
        type: 'string',
        description: 'schema definition',
    };

    const destPath = path.join(ctx.paths.project.dir, `packages/core/jsonSchema/${schemaId}.json`);
    fs.writeFileSync(destPath, JSON.stringify(jsonSchema, null, 2));

    const destPath2 = path.join(ctx.paths.project.dir, `.rnv/schema/${schemaId}.json`);
    fs.writeFileSync(destPath2, JSON.stringify(jsonSchema, null, 2));
};

import { Framework } from '@xyflow/xy-ui';
import { compileCodeSnippet } from './compile-code-snippet';
import { CompiledMdx, ExampleCode } from '../types';
import { loadJSONFile } from './utils';
import { ExamplesUrl } from './../utils';

import path from 'path';

export function getStaticCode(routes: string[], framework?: Framework) {
  const examplesUrl = ExamplesUrl();
  return async () => {
    const _framework =
      framework ?? process.env.NEXT_PUBLIC_FRAMEWORK ?? 'react';
    const codeSnippets: Record<string, Record<string, CompiledMdx>> = {};

    for (const route of routes) {
      const files: Record<string, CompiledMdx> = {};
      const url = `${examplesUrl}/${_framework}/${route}/source.json`;

      const p = path.join(
        '../../apps/example-apps/public',
        _framework,
        route,
        'source.json',
      );

      const json = loadJSONFile<ExampleCode>(p);

      if (!json || !('files' in json) || !('dependencies' in json)) {
        continue;
      }

      for (const [filename, file] of Object.entries(json.files)) {
        const filetype = filename.split('.').pop();
        const compiledSnippet = await compileCodeSnippet(file, { filetype });
        files[filename] = compiledSnippet;
      }

      codeSnippets[route] = files;
    }

    return {
      props: {
        codeSnippets,
      },
    };
  };
}

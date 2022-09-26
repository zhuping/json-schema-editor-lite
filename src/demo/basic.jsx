import React, { useState } from 'react';
import JsonSchemaEditor from 'json-schema-editor-lite';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types,no-console */
// noinspection NpmUsedModulesInstalled

export default () => {
  const [val, setVal] = useState();

  return (
    <div style={{ width: '90%' }}>
      <JsonSchemaEditor
        data={val}
        onChange={(value) => {
          setVal(value);
        }}
      />
    </div>
  );
};

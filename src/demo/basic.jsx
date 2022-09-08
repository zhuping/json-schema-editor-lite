import React, { useState, useEffect } from 'react';
import JsonSchemaEditor from 'json-schema-editor-lite';

/* eslint-disable @typescript-eslint/explicit-module-boundary-types,no-console */
// noinspection NpmUsedModulesInstalled

export default () => {
  const [val, setVal] = useState();
  let [key1, setKey1] = useState(1);


  useEffect(() => {
    setVal({
      "type": "object",
      "required": ["list"],
      "properties": {
        "list": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["item"],
            "properties": {
              "item": {
                "type": "object",
                "properties": {
                  "a": { "type": "string", "mock": { "mock": "1" } },
                  "b": { "type": "string", "mock": { "mock": "2" } }
                },
                "required": ["a", "b"]
              }
            }
          }
        }
      }
    });
    setKey1(++key1);
  }, []);

  console.log(val);

  return (
    <div style={{ width: '90%' }}>
      <JsonSchemaEditor
        key={key1}
        data={val}
        title={false}
        mock={false}
        onChange={(value) => {
          setVal(value);
        }}
      />
    </div>
  );
};

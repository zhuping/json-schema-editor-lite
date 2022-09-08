import React, { ReactElement } from 'react';
import SchemaItem from '../schema-item';
import Schema from '../../../types/Schema';

interface SchemaObjectProp {
  data: Schema;
  prefix: string[];
}

const SchemaObject = (props: SchemaObjectProp): ReactElement => {
  const { data, prefix } = props;
  return (
    <div>
      {Object.keys(data.properties).map((name, index) => {
        return (
          <SchemaItem
            key={index}
            data={data}
            name={name}
            prefix={prefix}
          />
        );
      })}
    </div>
  );
};

export default SchemaObject;

import React, { ReactElement, useContext } from 'react';
import { observer } from 'mobx-react';
// import SchemaArray from './schema-array';
import SchemaObject from './schema-object';
import SchemaTuple from './schema-tuple';
import { SchemaMobxContext } from '../../index';
import Schema from '../../types/Schema';

export const mapping = (
  name: string[],
  data: Schema,
): ReactElement => {
  switch (data.type) {
    // case 'array':
    //   return <SchemaArray prefix={name} data={data} />;
    case 'object':
      const nameArray = [].concat(name, 'properties');
      return <SchemaObject prefix={nameArray} data={data} />;
    case 'array':
      const pathArray = [].concat(name, 'prefixItems');
      return <SchemaTuple prefix={pathArray} data={data} />
    default:
      return null;
  }
};

const SchemaJson = observer((): ReactElement => {
  const mobxContext = useContext(SchemaMobxContext);

  return <div style={{ paddingTop: 8 }}>{mapping([], mobxContext.schema)}</div>;
});

export default SchemaJson;

import React, { ReactElement } from 'react';
import TupleItem from '../tuple-item';
import Schema from '../../../types/Schema';

interface SchemaTupleProp {
  data: Schema;
  prefix: string[];
}

const SchemaTuple = (props: SchemaTupleProp): ReactElement => {
  const { data, prefix } = props;
  return (
    <div>
      {
        data.prefixItems.map((value, index) => {
          return (
            <TupleItem
              key={index}
              value={value}
              idx={index}
              prefix={prefix}
            />
          );
        })
      }
    </div>
  );
};

export default SchemaTuple;

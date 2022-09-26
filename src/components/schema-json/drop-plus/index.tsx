import React, { ReactElement, useContext } from 'react';
import { Dropdown, Menu, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { PlusOutlined } from '@ant-design/icons';
import { SchemaMobxContext } from '../../..';
import LocalProvider from '../../local-provider/index';

interface DropPlusProp {
  prefix: string[];
  type: string;
  name?: string;
  idx?: number;
}

const DropPlus = observer((props: DropPlusProp): ReactElement => {
  const { prefix, name, idx, type } = props;

  const context = useContext(SchemaMobxContext);

  const menu = (
    <Menu
      items={[
        {
          key: 'sibling_node',
          label: (
            <span
              onClick={() =>
                name ? context.addField({ keys: prefix, name }) : context.addItem({ keys: prefix })
              }
            >
              {LocalProvider('sibling_node')}
            </span>
          ),
        },
        {
          key: 'child_node',
          label: (
            <span
              onClick={() => {
                if (name) {
                  if (type === 'object') {
                    context.setOpenValue({
                      key: prefix.concat(name, 'properties'),
                      value: true,
                    });
                    context.addChildField({ keys: prefix.concat(name, 'properties') });
                  } else {
                    context.addChildItem({ keys: prefix.concat(name, 'prefixItems') });
                  }
                }

                if (idx !== undefined) {
                  // 元组创建对象子节点
                  if (type === 'object') {
                    context.setOpenValue({
                      key: prefix.concat(String(idx), 'properties'),
                      value: true,
                    });
                    context.addChildField({ keys: prefix.concat(String(idx), 'properties') });
                  } else {
                    // 元组创建元组子节点
                    context.addChildItem({ keys: prefix.concat(String(idx), 'prefixItems') });
                  }
                }
              }}
            >
              {LocalProvider('child_node')}
            </span>
          ),
        },
      ]}
    />
  );

  return (
    <Tooltip placement="top" title={LocalProvider('add_node')}>
      <Dropdown overlay={menu}>
        <PlusOutlined style={{ color: '#2395f1' }} />
      </Dropdown>
    </Tooltip>
  );
});

export default DropPlus;

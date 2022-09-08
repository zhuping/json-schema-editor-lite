import React, { CSSProperties, ReactElement, useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Col, Input, Row, Select, Space, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import { SchemaMobxContext } from '../../..';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '../../../constants';
import { mapping } from '../index';
import Schema from '../../../types/Schema';
import LocalProvider from '../../local-provider/index';

interface SchemaArrayProp {
  data: Schema;
  prefix: string[];
}

const SchemaArray = observer((props: SchemaArrayProp): ReactElement => {
  const { data, prefix } = props;

  // noinspection DuplicatedCode
  const [tagPaddingLeftStyle, setTagPaddingLeftStyle] = useState<CSSProperties>({});

  // const context = useContext(EditorContext);
  const mobxContext = useContext(SchemaMobxContext);

  useEffect(() => {
    const length = props.prefix.filter((name) => name !== 'properties').length;
    setTagPaddingLeftStyle({
      paddingLeft: `${20 * (length + 1)}px`,
    });
  }, [props.prefix]);

  const getPrefix = () => {
    return [].concat(prefix, 'items');
  };

  // 修改数据类型
  const handleChangeType = (value: string) => {
    const keys = getPrefix().concat('type');
    mobxContext.changeType({ keys, value });
  };

  // 修改备注信息
  const handleChangeDesc = (value) => {
    const key = getPrefix().concat(`description`);
    mobxContext.changeValue({ keys: key, value });
  };

  // 修改值
  const handleChangeValue = (e) => {
    const key = getPrefix().concat('mock');
    const value = e ? { mock: e.target.value } : '';
    mobxContext.changeValue({ keys: key, value });
  };

  // 增加子节点
  const handleAddChildField = () => {
    const keyArr = getPrefix().concat('properties');
    mobxContext.addChildField({ keys: keyArr });
    mobxContext.setOpenValue({ key: keyArr, value: true });
  };

  const handleClickIcon = () => {
    // 数据存储在 properties.name.properties下
    const keyArr = getPrefix().concat('properties');
    mobxContext.setOpenValue({ key: keyArr });
  };

  const items = data.items;
  const prefixArray = [].concat(prefix, 'items');

  const prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);

  return data.items !== undefined ? (
    <div>
      <Row gutter={11} justify="space-around" align="middle">
        <Col flex="auto">
          <Row gutter={11} justify="space-around" align="middle">
            <Col span={10} style={tagPaddingLeftStyle}>
              <Row justify="space-around" align="middle" className="field-name">
                <Col flex="20px">
                  {items.type === 'object' ? (
                    <span className="show-hide-children" onClick={handleClickIcon}>
                      {_.get(mobxContext.open, [prefixArrayStr]) ? (
                        <CaretDownOutlined />
                      ) : (
                        <CaretRightOutlined />
                      )}
                    </span>
                  ) : null}
                </Col>
                <Col flex="auto">
                  <Input disabled value="Items" />
                </Col>
              </Row>
            </Col>
            <Col span={4}>
              <Select style={{ width: '100%' }} onChange={handleChangeType} value={items.type}>
                {SCHEMA_TYPE.map((item, index) => {
                  return (
                    <Select.Option value={item} key={index}>
                      {item}
                    </Select.Option>
                  );
                })}
              </Select>
            </Col>
            <Col span={4}>
              <Input
                placeholder={LocalProvider('value')}
                disabled={items.type === 'object' || items.type === 'array'}
                value={items.mock ? (typeof items.mock !== 'string' ? items.mock?.mock : items.mock) : ''}
                onChange={handleChangeValue}
              />
            </Col>
            <Col span={4}>
              <Input
                placeholder={LocalProvider('description')}
                value={items.description}
                onChange={handleChangeDesc}
              />
            </Col>
            <Col span={2}>
              <Space>
                {items.type === 'object' || items.type === 'array' ? (
                  <span className="plus" onClick={handleAddChildField}>
                    <Tooltip placement="top" title={LocalProvider('add_child_node')}>
                      <PlusOutlined />
                    </Tooltip>
                  </span>
                ) : null}
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ paddingTop: 8 }}>{mapping(prefixArray, items)}</div>
    </div>
  ) : (
    <></>
  );
});

export default SchemaArray;

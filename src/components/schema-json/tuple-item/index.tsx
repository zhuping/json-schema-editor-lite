import React, { CSSProperties, ReactElement, useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { Col, Input, Row, Select, Tooltip, Space } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { SchemaMobxContext } from '../../..';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '../../../constants';
import DropPlus from '../drop-plus';
import { mapping } from '../index';
import Schema from '../../../types/Schema';
import LocalProvider from '../../local-provider/index';

const Option = Select.Option;

interface TupleItemProp {
  value: Schema;
  idx: number;
  prefix: string[];
}

const TupleItem = observer((props: TupleItemProp): ReactElement => {
  const { value, idx, prefix } = props;

  const [tagPaddingLeftStyle, setTagPaddingLeftStyle] = useState<CSSProperties>({});
  const mobxContext = useContext(SchemaMobxContext);

  useEffect(() => {
    const length = props.prefix.filter((name) => !['properties', 'prefixItems'].includes(name)).length;
    setTagPaddingLeftStyle({
      paddingLeft: `${20 * (length + 1)}px`,
    });
  }, [props.prefix]);

  const getPrefix = () => {
    return [].concat(prefix, idx);
  };

  // 修改备注信息
  const handleChangeDesc = (e) => {
    const key = getPrefix().concat('description');
    mobxContext.changeValue({ keys: key, value: e.target.value });
  };

  // 修改值
  const handleChangeValue = (e) => {
    const key = getPrefix().concat('mock');
    const value = e ? { mock: e.target.value } : '';
    mobxContext.changeValue({ keys: key, value });
  };

  // 修改数据类型
  const handleChangeType = (value) => {
    const keys = getPrefix().concat('type');
    mobxContext.changeType({ keys, value });
  };

  const handleDeleteItem = () => {
    mobxContext.deleteItem({ keys: getPrefix() });
  };

  //  增加子节点
  const handleAddField = () => {
    mobxContext.addItem({ keys: prefix });
  };

  // 控制三角形按钮
  const handleClickIcon = () => {
    // 数据存储在 properties.xxx.properties 下
    const keyArr = getPrefix().concat('properties');
    mobxContext.setOpenValue({ key: keyArr });
  };

  const prefixArray = [].concat(prefix, idx);
  const prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);

  return (
    <div>
      <Row justify="space-around" gutter={11} align="middle">
        <Col flex="auto">
          <Row justify="space-around" gutter={11} align="middle">
            <Col span={8} style={tagPaddingLeftStyle}>
              <Row justify="space-around" align="middle" className="field-name">
                <Col flex="20px">
                  {value.type === 'object' ? (
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
                  <Input disabled value={idx} />
                </Col>
              </Row>
            </Col>

            <Col span={4}>
              <Select style={{ width: '100%' }} onChange={handleChangeType} value={value.type}>
                {SCHEMA_TYPE.map((item, index) => {
                  return (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Col>

            <Col span={5}>
              <Input
                placeholder={LocalProvider('value')}
                disabled={
                  value.type === 'object' || value.type === 'array' || value.type === 'tuple'
                }
                value={
                  value.mock ? (typeof value.mock !== 'string' ? value.mock?.mock : value.mock) : ''
                }
                onChange={handleChangeValue}
              />
            </Col>

            <Col span={5}>
              <Input
                placeholder={LocalProvider('description')}
                value={value.description}
                onChange={handleChangeDesc}
              />
            </Col>

            <Col span={2}>
              <Space>
                <span className="close" onClick={handleDeleteItem}>
                  <CloseOutlined />
                </span>
                <span className="plus">
                  {value.type === 'object' || value.type === 'array' ? (
                    <DropPlus prefix={prefix} idx={idx} type={value.type} />
                  ) : (
                    <Tooltip placement="top" title={LocalProvider('add_sibling_node')}>
                      <PlusOutlined onClick={handleAddField} />
                    </Tooltip>
                  )}
                </span>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
      <div style={{ paddingTop: 8 }}>{mapping(prefixArray, value)}</div>
    </div>
  );
});

export default TupleItem;

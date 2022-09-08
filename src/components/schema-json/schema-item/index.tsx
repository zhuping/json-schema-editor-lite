import React, { CSSProperties, ReactElement, useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { Col, Input, message, Row, Select, Tooltip, Space } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { SchemaMobxContext } from '../../..';
import FieldInput from '../../field-input';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '../../../constants';
import DropPlus from '../drop-plus';
import { mapping } from '../index';
import Schema from '../../../types/Schema';
import LocalProvider from '../../local-provider/index';

const Option = Select.Option;

interface SchemaItemProp {
  data: Schema;
  name: string;
  prefix: string[];
}

const SchemaItem = observer((props: SchemaItemProp): ReactElement => {
  const { data, name, prefix } = props;

  // noinspection DuplicatedCode
  const [tagPaddingLeftStyle, setTagPaddingLeftStyle] = useState<CSSProperties>({});

  // const context = useContext(EditorContext);
  const mobxContext = useContext(SchemaMobxContext);

  useEffect(() => {
    const length = props.prefix.filter((name) => !['properties', 'prefixItems'].includes(name)).length;
    setTagPaddingLeftStyle({
      paddingLeft: `${20 * (length + 1)}px`,
    });
  }, [props.prefix]);

  const getPrefix = () => {
    return [].concat(prefix, name);
  };

  // 修改节点字段名
  const handleChangeName = (value) => {
    if (data.properties[value] && typeof data.properties[value] === 'object') {
      message.error(`The field "${value}" already exists.`).then();
      return false;
    }
    mobxContext.changeName({ keys: prefix, name, value });
    return true;
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
    mobxContext.deleteField({ keys: getPrefix() });
    mobxContext.enableRequire({ keys: prefix, name, required: false });
  };

  //  增加子节点
  const handleAddField = () => {
    mobxContext.addField({ keys: prefix, name });
  };

  // 控制三角形按钮
  const handleClickIcon = () => {
    // 数据存储在 properties.xxx.properties 下
    const keyArr = getPrefix().concat('properties');
    mobxContext.setOpenValue({ key: keyArr });
  };

  const value = data.properties[name];

  const prefixArray = [].concat(prefix, name);

  const prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);

  return _.get(mobxContext.open, prefix.join(JSONPATH_JOIN_CHAR)) ? (
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
                  <FieldInput onChange={handleChangeName} value={name} />
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
                disabled={value.type === 'object' || value.type === 'array'}
                value={value.mock ? (typeof value.mock !== 'string' ? value.mock?.mock : value.mock) : ''}
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
                    <DropPlus prefix={prefix} name={name} type={value.type} />
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
  ) : null;
});

export default SchemaItem;

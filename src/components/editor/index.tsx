import React, { createContext, ReactElement, useContext, useState } from 'react';
import { createSchema } from 'genson-js/dist';
import { Button, Col, Input, message, Modal, Row, Select, Tabs, Tooltip, Space } from 'antd';
import { CaretDownOutlined, CaretRightOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { SCHEMA_TYPE } from '../../constants';
import { SchemaMobxContext } from '../../index';
import QuietEditor from '../quiet-editor';
import SchemaJson from '../schema-json';
import Schema from '../../types/Schema';
import LocalProvider from '../local-provider/index';

interface EditorContextProp {
  changeCustomValue: (newValue: Schema) => void;
}

export const EditorContext = createContext<EditorContextProp>({
  changeCustomValue: () => {},
});

const Editor = observer((): ReactElement => {
  const schemaMobx = useContext(SchemaMobxContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stateVal, setStateVal] = useState<Record<string, any>>({
    visible: false,
    show: true,
    curItemCustomValue: null,
    mock: '',
  });

  const [jsonSchemaData, setJsonSchemaData] = useState<string>();
  const [jsonData, setJsonData] = useState<string | undefined>();
  const [importJsonType, setImportJsonType] = useState<string | null>(null);

  // json 导入弹窗
  const showModal = () => {
    setStateVal((prevState) => {
      return { ...prevState, visible: true };
    });
  };

  const handleOk = () => {
    if (importJsonType !== 'schema') {
      if (!jsonData) {
        return;
      }
      let jsonObject = null;
      try {
        jsonObject = JSON.parse(jsonData);
      } catch (ex) {
        message.error('json 数据格式有误').then();
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const jsonDataVal: any = { ...createSchema(jsonObject) };
      schemaMobx.changeSchema(jsonDataVal);
    } else {
      if (!jsonSchemaData) {
        return;
      }
      let jsonObject = null;
      try {
        jsonObject = JSON.parse(jsonSchemaData);
      } catch (ex) {
        message.error('json 数据格式有误').then();
        return;
      }
      schemaMobx.changeSchema(jsonObject);
    }
    setStateVal((prevState) => {
      return { ...prevState, visible: false };
    });
  };

  const handleCancel = () => {
    setStateVal((prevState) => {
      return { ...prevState, visible: false };
    });
  };

  // 修改数据类型
  const handleChangeType = (key: string, value: string) => {
    schemaMobx.changeType({ keys: [key], value });
  };

  const handleImportJson = (value: string | undefined) => {
    if (!value) {
      setJsonData(undefined);
    } else {
      setJsonData(value);
    }
  };

  const handleImportJsonSchema = (value: string | undefined) => {
    if (!value) {
      setJsonSchemaData(undefined);
    } else {
      setJsonSchemaData(value);
    }
  };

  // 增加子节点
  const handleAddChildField = (key: string) => {
    schemaMobx.addChildField({ keys: [key] });
    setStateVal((prevState) => {
      return { ...prevState, show: true };
    });
  };

  // 增加元组元素
  const handleAddChildItem = (key: string) => {
    schemaMobx.addChildItem({ keys: [key] });
    setStateVal((prevState) => {
      return { ...prevState, show: true };
    });
  };

  const clickIcon = () => {
    setStateVal((prevState) => {
      return { ...prevState, show: !prevState.show };
    });
  };

  // 修改备注信息
  const handleChangeValue = (key: string[], value: string) => {
    let changeValue: string | boolean | { mock: string } = value;
    if (key[0] === 'mock' && value) {
      changeValue = { mock: value };
    }
    schemaMobx.changeValue({ keys: key, value: changeValue });
  };

  //  修改弹窗中的json-schema 值
  const changeCustomValue = (newValue: Schema) => {
    setStateVal((prevState) => {
      return { ...prevState, curItemCustomValue: newValue };
    });
  };

  const { visible } = stateVal;

  return (
    <EditorContext.Provider
      value={{
        changeCustomValue,
      }}
    >
      <div className="json-schema-react-editor">
        <Button type="primary" onClick={showModal}>
          {LocalProvider('import_json')}
        </Button>
        <Modal
          width={750}
          maskClosable={false}
          visible={visible}
          title={LocalProvider('import_json')}
          onOk={handleOk}
          onCancel={handleCancel}
          className="json-schema-react-editor-import-modal"
          footer={[
            <Button key="back" onClick={handleCancel}>
              {LocalProvider('cancel')}
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              {LocalProvider('ok')}
            </Button>,
          ]}
        >
          <Tabs
            defaultValue="json"
            onChange={(key) => {
              setImportJsonType(key);
            }}
          >
            <Tabs.TabPane tab="JSON" key="json">
              <QuietEditor height={300} language="json" onChange={handleImportJson} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="JSON-SCHEMA" key="schema">
              <QuietEditor height={300} language="json" onChange={handleImportJsonSchema} />
            </Tabs.TabPane>
          </Tabs>
        </Modal>

        <Row style={{ marginTop: 10 }}>
          <Col span={24} className="wrapper">
            <Row align="middle" gutter={11}>
              <Col flex="auto">
                <Row align="middle" gutter={11}>
                  <Col span={8}>
                    <Row justify="space-around" align="middle" className="field-name">
                      <Col flex="20px">
                        {schemaMobx.schema.type === 'object' ? (
                          <span className="show-hide-children" onClick={clickIcon}>
                            {stateVal.show ? <CaretDownOutlined /> : <CaretRightOutlined />}
                          </span>
                        ) : null}
                      </Col>
                      <Col flex="auto">
                        <Input disabled value="root" />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={4}>
                    <Select
                      style={{ width: '100%' }}
                      onChange={(value) => handleChangeType(`type`, value)}
                      value={schemaMobx.schema.type || 'object'}
                    >
                      {SCHEMA_TYPE.map((item, index) => {
                        return (
                          <Select.Option value={item} key={index}>
                            {item}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder={LocalProvider('value')}
                      onChange={(ele) => handleChangeValue(['mock'], ele.target.value)}
                      disabled={
                        schemaMobx.schema.type === 'object' ||
                        schemaMobx.schema.type === 'array' ||
                        schemaMobx.schema.type === 'tuple'
                      }
                      value={
                        schemaMobx.schema.mock
                          ? typeof schemaMobx.schema.mock !== 'string'
                            ? schemaMobx.schema.mock?.mock
                            : schemaMobx.schema.mock
                          : ''
                      }
                    />
                  </Col>
                  <Col span={5}>
                    <Input
                      placeholder={LocalProvider('description')}
                      value={schemaMobx.schema.description}
                      onChange={(ele) => handleChangeValue(['description'], ele.target.value)}
                    />
                  </Col>
                  <Col span={2}>
                    <Space>
                      {schemaMobx.schema.type === 'object' ? (
                        <span className="plus" onClick={() => handleAddChildField('properties')}>
                          <Tooltip placement="top" title={LocalProvider('add_child_node')}>
                            <PlusOutlined />
                          </Tooltip>
                        </span>
                      ) : schemaMobx.schema.type === 'array' ? (
                        <span className="plus" onClick={() => handleAddChildItem('prefixItems')}>
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
            {stateVal.show && <SchemaJson />}
          </Col>
        </Row>
      </div>
    </EditorContext.Provider>
  );
});

export default Editor;

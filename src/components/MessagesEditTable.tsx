import { FC, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Table, Input, InputRef, Space, Empty, Button, Flex } from "antd";
import { useIsDark } from "@/hooks/useIsDark";
import { MessagesRecordType } from "@/types";
import { AntdApiContext, AntdApiContextType } from "$/AntdApiContext";
import styled from "styled-components";

export type MessagesEditTableProps = {
  data: MessagesRecordType[];
  onChange: (data: MessagesRecordType[]) => void;
  tableHeight?: number | string;
  //  字数限制
  limitation?: {
    title?: number;
    content?: number;
  };
};

const MessagesEditTable: FC<MessagesEditTableProps> = ({
  data = [],
  onChange = () => {},
  tableHeight = "460px",
  limitation = {},
}) => {
  const { messageApi } = useContext(AntdApiContext) as AntdApiContextType;
  const { title: titleLimit = 15, content: contentLimit = 2000 } = limitation;

  const { t } = useTranslation();

  function handleRecordUpdate(record: MessagesRecordType) {
    const index = data.findIndex((item) => item.label === record.label);
    data[index] = record;
    onChange([...data]);
  }

  function handleAdd() {
    const newData = [
      {
        label: `#${data.length + 1}`,
        content: "",
      },
      ...data,
    ];

    onChange(newData);

    messageApi.success(t("createSuccessfully"));
  }

  function handleDelete(label: string) {
    const newData = data.filter((item) => item.label !== label);
    onChange(newData);
  }

  return (
    <Table
      bordered
      dataSource={data}
      pagination={false}
      rowKey={"label"}
      size={"small"}
      scroll={{
        y: tableHeight,
        x: true,
      }}
      locale={{
        emptyText: () => {
          return (
            <Space
              direction={"vertical"}
              size={24}
              style={{
                width: "100%",
                textAlign: "center",
                padding: "62px 0px",
              }}
            >
              <Empty />
              <Button type={"primary"} onClick={handleAdd}>
                {t("create")}
              </Button>
            </Space>
          );
        },
      }}
      footer={() => {
        return (
          <Flex style={{ width: "100%" }} justify={"space-between"}>
            <Space>
              <div></div>
            </Space>
            <Space>
              <Button type={"primary"} onClick={handleAdd}>
                {t("create")}
              </Button>
            </Space>
          </Flex>
        );
      }}
    >
      <Table.Column
        title={t("titleFieldName")}
        key={"label"}
        dataIndex={"label"}
        width={400}
        render={(text, record: MessagesRecordType) => {
          return (
            <EditableCell
              maxLength={titleLimit}
              type={"input"}
              value={text}
              onChange={(val) => {
                if (record.label === val) return;
                if (data.find((record) => record.label === val)) {
                  messageApi.error(t("cannotSavedMessageCuzLabelExisted"));
                  return;
                }
                if (val.trim() === "") {
                  messageApi.error(t("cannotSavedMessageCuzLabelEmpty"));
                  return;
                }

                record.label = val;
                handleRecordUpdate(record);
              }}
            />
          );
        }}
      />
      <Table.Column
        title={t("content")}
        key={"content"}
        dataIndex={"content"}
        width={400}
        render={(text, record: MessagesRecordType) => {
          return (
            <EditableCell
              maxLength={contentLimit}
              type={"textarea"}
              value={text}
              onChange={(val) => {
                if (val.trim() === "") {
                  messageApi.error(t("cannotSavedMessageCuzContentEmpty"));
                  return;
                }
                record.content = val;
                handleRecordUpdate(record);
              }}
            />
          );
        }}
      />
      <Table.Column
        title={"操作"}
        dataIndex="id"
        key="id"
        width={120}
        render={(id, record: MessagesRecordType) => {
          return (
            <Space size={4}>
              <Button
                size={"small"}
                type={"text"}
                danger={true}
                onClick={() => handleDelete(record.label)}
              >
                {t("delete")}
              </Button>
            </Space>
          );
        }}
      />
    </Table>
  );
};

const EditableWrapper = styled.div<{ $isDark: boolean }>`
  border: 1px solid transparent;
  padding: 0 4px;
  margin: 0 -4px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    border-color: ${(p) => (p.$isDark ? "#4d4848" : "#c0bbbb")};
  }
`;
function EditableCell(props: {
  value: string;
  onChange: (value: string) => void;
  type: "input" | "textarea";
  maxLength: number;
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const isDark = useIsDark();

  useEffect(() => {
    if (editing && inputRef.current) {
      if (props.type === "input") {
        inputRef.current!.select();
      } else {
        inputRef.current!.focus();
      }
    }
  }, [editing, props.type]);

  function handleClick() {
    setEditing(true);
  }

  function handleBlur(val: string) {
    setEditing(false);
    props.onChange(val);
  }

  function handleSave(val: string) {
    props.onChange(val);
    inputRef.current!.blur();
  }

  if (editing) {
    if (props.type === "textarea") {
      return (
        <div style={{ paddingBottom: 18 }}>
          <Input.TextArea
            showCount={true}
            maxLength={props.maxLength}
            defaultValue={props.value}
            ref={inputRef}
            size={"small"}
            style={{ width: "100%" }}
            autoSize={{ minRows: 4, maxRows: 4 }}
            onBlur={(ev) => handleBlur(ev.target.value)}
            onKeyDown={(ev) => {
              if (ev.key === "Enter") {
                if (ev.shiftKey || ev.ctrlKey || ev.metaKey) {
                  return;
                } else {
                  ev.preventDefault();
                  const target = ev.target as HTMLInputElement;
                  handleSave(target.value);
                  return false;
                }
              }
            }}
          />
        </div>
      );
    } else if (props.type === "input") {
      return (
        <Input
          showCount={true}
          maxLength={props.maxLength}
          defaultValue={props.value}
          ref={inputRef}
          size={"small"}
          style={{ width: "100%" }}
          onBlur={(ev) => handleBlur(ev.target.value)}
          onPressEnter={(ev) => {
            const target = ev.target as HTMLInputElement;
            handleSave(target.value);
          }}
        />
      );
    }
  }

  return (
    <EditableWrapper onClick={handleClick} $isDark={isDark}>
      <div
        style={{ minHeight: 22 }}
        dangerouslySetInnerHTML={{
          __html:
            props.value.trim().split("\n").slice(0, 4).join("<br/>") +
            (props.value.trim().split("\n").length > 4 ? "..." : ""),
        }}
      />
    </EditableWrapper>
  );
}

export default MessagesEditTable;

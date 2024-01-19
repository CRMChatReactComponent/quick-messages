import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Popconfirm,
  MenuProps,
  Menu,
  Empty,
  Space,
  Flex,
  Button,
  Input,
  InputRef,
  Popover,
  Alert,
  ColorPicker,
} from "antd";
import { MessagesEditTableProps } from "@/components/MessagesEditTable";
import { MessagesGroupType, MessagesRecordType } from "@/types";
import { uuidv4 } from "@/utils";
import MessagesEditTable from "./MessagesEditTable";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import styled from "styled-components";

export type MessageConfigsPanelProps = {
  data: MessagesGroupType[];
  onChange: (data: MessagesGroupType[]) => void;
} & Pick<MessagesEditTableProps, "tableHeight" | "limitation">;
type GroupDataEditType = Pick<MessagesGroupType, "title" | "color">;

const Wrapper = styled.div``;
const MenuWrapper = styled.div`
  min-height: 380px;
`;
const TableDataCountWrapper = styled.span`
  font-size: 12px;
`;
const GroupNameWrapper = styled.div`
  &:hover {
    .ant-btn {
      display: block;
    }
  }
  .ant-btn {
    display: none;
  }
`;
const ColorDiv = styled.div<{ $color: string }>`
  background-color: ${(p) => p.$color};
  width: 12px;
  height: 12px;
  border: 1px solid #fff;
  border-radius: 4px;
`;

const MessageConfigsPanel: FC<MessageConfigsPanelProps> = ({
  data = [],
  onChange = () => {},
  ...resetProps
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (data.length > 0) {
      setSelectedKeys([data[0].id]);
    }
  }, []);

  const menuItems = useMemo<Required<MenuProps>["items"]>(() => {
    return data.map((item) => {
      return {
        key: item.id,
        label: (
          <GroupNameWrapper>
            <Flex justify={"space-between"} align={"center"}>
              <Space>
                <span>{item.title}</span>

                {item.data.length ? (
                  <TableDataCountWrapper>
                    ({item.data.length})
                  </TableDataCountWrapper>
                ) : null}
              </Space>

              <Space size={8}>
                <ColorDiv $color={item.color} />
                <EditGroupButton
                  data={item}
                  onSaved={(data) => handleUpdateGroup(item.id, data)}
                />
                <Popconfirm
                  title={t("confirmDelete")}
                  onConfirm={() => handleDeleteGroup(item.id)}
                >
                  <Button
                    danger={true}
                    size={"small"}
                    icon={<DeleteOutlined />}
                    type={"text"}
                  />
                </Popconfirm>
              </Space>
            </Flex>
          </GroupNameWrapper>
        ),
      };
    });
  }, [data]);

  const tableData = useMemo<MessagesRecordType[] | false>(() => {
    const selected = selectedKeys[0];
    if (selected) {
      const target = data.find((item) => item.id === selected);
      if (target) {
        return target.data;
      }
    }

    return false;
  }, [selectedKeys, data]);

  function handleUpdateGroup(
    id: MessagesGroupType["id"],
    _data: GroupDataEditType,
  ) {
    const newData = [...data];
    const index = newData.findIndex((group) => group.id === id);
    if (!!~index) {
      newData[index] = {
        ...newData[index],
        ..._data,
      };
    }
    onChange(newData);
  }

  function handleDeleteGroup(id: MessagesGroupType["id"]) {
    const newData = [...data].filter((group) => group.id !== id);

    onChange(newData);
  }

  function handleTableDataChange(tableData: MessagesRecordType[]) {
    const newData = [...data];

    const selected = selectedKeys[0];
    if (selected) {
      const target = newData.find((item) => item.id === selected);
      if (target) {
        target.data = tableData;
      }
    }

    onChange(newData);
  }

  function handleSaved(_data: GroupDataEditType) {
    const id = uuidv4();
    const newData = [...data];
    newData.push({
      id,
      color: _data.color,
      title: _data.title,
      data: [],
    });
    onChange(newData);
    setSelectedKeys([id]);
  }

  if (menuItems.length === 0) {
    return (
      <Flex vertical={true} align={"center"} gap={8}>
        <Empty description={t("noData")} />
        <AddAGroupBtn onCreate={handleSaved} />
      </Flex>
    );
  }

  return (
    <Wrapper>
      <Flex gap={16}>
        <Space direction={"vertical"}>
          <MenuWrapper>
            <Menu
              items={menuItems}
              style={{ width: 300 }}
              selectedKeys={selectedKeys}
              onSelect={({ key }) => {
                setSelectedKeys([key]);
              }}
            />
          </MenuWrapper>
          <AddAGroupBtn onCreate={handleSaved} block={true} />
        </Space>
        {tableData ? (
          <MessagesEditTable
            data={tableData}
            onChange={handleTableDataChange}
            {...resetProps}
          />
        ) : (
          <Alert
            type={"info"}
            message={t("selectAGroupFirst")}
            style={{ height: 60, minWidth: 400 }}
          />
        )}
      </Flex>
    </Wrapper>
  );
};

function EditGroupButton(props: {
  data: GroupDataEditType;
  onSaved: (data: GroupDataEditType) => void;
}) {
  const [data, setData] = useState<GroupDataEditType>({ title: "", color: "" });

  return (
    <AddAGroupWrap
      isEdit={false}
      onCompleteChange={props.onSaved}
      data={data}
      onOpenChange={(open) => {
        if (open) {
          setData(props.data);
        }
      }}
      onDataChange={(data) => setData(data)}
    >
      <Button size={"small"} icon={<EditOutlined />} type={"text"} />
    </AddAGroupWrap>
  );
}

function AddAGroupBtn(props: {
  block?: boolean;
  onCreate: (data: GroupDataEditType) => void;
}) {
  const { t } = useTranslation();
  const defaultData = {
    title: "",
    color: "#1677FF",
  };
  const [data, setData] = useState<GroupDataEditType>({
    ...defaultData,
  });

  return (
    <AddAGroupWrap
      isEdit={false}
      onCompleteChange={props.onCreate}
      data={data}
      onOpenChange={(open) => {
        if (open) {
          setData({
            ...defaultData,
          });
        }
      }}
      onDataChange={(data) => setData(data)}
    >
      <Button block={!!props.block} icon={<PlusOutlined />}>
        {t("addNewGroup")}
      </Button>
    </AddAGroupWrap>
  );
}

function AddAGroupWrap(props: {
  data: GroupDataEditType;
  onDataChange: (data: GroupDataEditType) => void;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  onCompleteChange: (data: GroupDataEditType) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("");
  const inputRef = useRef<InputRef>(null);
  const { t } = useTranslation();

  useEffect(() => {
    props.onOpenChange(open);
  }, [open]);

  useEffect(() => {
    if (open) {
      setColor(props.data.color);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    } else {
      setColor("");
    }
  }, [props.data]);

  function handleSaved() {
    if (props.data.title.trim().length === 0) return;
    props.onCompleteChange({
      title: props.data.title.trim(),
      color: props.data.color,
    });
    setOpen(false);
  }

  function handleDataChange<T extends keyof GroupDataEditType>(
    key: T,
    value: GroupDataEditType[T],
  ) {
    props.onDataChange({
      ...props.data,
      [key]: value,
    });
  }

  return (
    <>
      <Popover
        title={props.isEdit ? t("editGroup") : t("createGroup")}
        open={open}
        onOpenChange={setOpen}
        trigger={["click"]}
        content={
          <Space direction={"vertical"} size={16}>
            <Space size={16}>
              <span>{t("titleFieldName")}:</span>
              <Input
                ref={inputRef}
                showCount={true}
                maxLength={20}
                value={props.data.title}
                onChange={(ev) => handleDataChange("title", ev.target.value)}
              />
            </Space>
            <Space size={16}>
              <span>{t("colorFieldName")}:</span>
              {color && (
                <ColorPicker
                  value={color}
                  onChange={(color) => setColor(`#${color.toHex()}`)}
                  showText
                  onChangeComplete={(color) => {
                    handleDataChange("color", `#${color.toHex()}`);
                  }}
                />
              )}
            </Space>
            <Button block={true} type={"primary"} onClick={handleSaved}>
              {props.isEdit ? t("create") : t("save")}
            </Button>
          </Space>
        }
      >
        {props.children}
      </Popover>
    </>
  );
}

export default MessageConfigsPanel;

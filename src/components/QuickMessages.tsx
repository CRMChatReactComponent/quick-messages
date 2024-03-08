import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";
import { Button, Flex, Space, Tooltip } from "antd";
import { MessageConfigsPanelProps } from "@/components/MessageConfigsPanel";
import MessageConfigsPanelModalWrapper from "@/components/MessageConfigsPanelModalWrapper";
import { MessagesGroupType, MessagesRecordType, SlotType } from "@/types";
import { limitText } from "@/utils";
import { SettingOutlined } from "@ant-design/icons";
import Color from "color";
import styled from "styled-components";

export type QuickMessagesProps = {
  /**
   * 当快捷消息点击时回调
   * @param message
   */
  onSelect?: (message: MessagesRecordType) => void;
  /**
   * 最大显示标题长度
   */
  displayTitleMaxLength?: number;
  /**
   * 最大显示一行多少个
   */
  displayMaxLength?: number;
  /**
   * 快捷消息左侧 slot
   */
  SlotContentPrefixSlot?: SlotType;
  /**
   * 快捷消息右侧 slot
   */
  SlotContentSuffixSlot?: SlotType;
} & MessageConfigsPanelProps;

const LabelDiv = styled.div`
  font-size: 14px;
  background: #dae5f8;
  padding: 0 4px;
  border-radius: 2px;
  cursor: pointer;
  min-width: 20px;
  user-select: none;
  color: #333;
  white-space: nowrap;

  &:hover {
    background-color: #bcd0f3;
  }

  &:active {
    background-color: #9dbcf3;
  }
`;

const MessagesListWrapper = styled.div`
  min-height: 18px;
`;

const QuickMessages: FC<QuickMessagesProps> = ({
  data = [],
  onChange,
  tableHeight,
  limitation,
  displayTitleMaxLength = 10,
  displayMaxLength = 99,
  SlotContentPrefixSlot,
  SlotContentSuffixSlot,
  onSelect = () => {},
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useLocalStorage<string>(
    "__activeGroupId",
    "",
  );

  const { t } = useTranslation();

  const currentGroup = useMemo(() => {
    return data.find((group) => group.id === activeGroupId);
  }, [activeGroupId, data]);
  const messagesList = useMemo(() => {
    if (!currentGroup) return [];
    return currentGroup.data;
  }, [currentGroup, data]);
  const isEmpty = useMemo(() => {
    return data.length === 0;
  }, [data]);

  return (
    <>
      {isEmpty ? (
        <Button
          size={"small"}
          type={"primary"}
          onClick={() => setModalOpen(true)}
        >
          {t("create")}
        </Button>
      ) : (
        <Space size={2} direction={"vertical"}>
          <MessagesListWrapper>
            <Space size={8}>
              {messagesList.slice(0, displayMaxLength).map((message) => {
                return (
                  <Tooltip
                    key={message.label}
                    title={
                      <span style={{ fontSize: 12 }}>{message.label}</span>
                    }
                    destroyTooltipOnHide={true}
                  >
                    <LabelDiv
                      onClick={(ev) => {
                        const target = ev.target as HTMLDivElement;
                        if (!!target.closest("bdi")) return;
                        onSelect(message);
                      }}
                    >
                      {SlotContentPrefixSlot && (
                        <bdi>
                          <SlotContentPrefixSlot
                            group={currentGroup}
                            message={message}
                          />
                        </bdi>
                      )}

                      {limitText(message.label, displayTitleMaxLength)}

                      {SlotContentSuffixSlot && (
                        <bdi>
                          <SlotContentSuffixSlot
                            group={currentGroup}
                            message={message}
                          />{" "}
                        </bdi>
                      )}
                    </LabelDiv>
                  </Tooltip>
                );
              })}
            </Space>
          </MessagesListWrapper>

          <Space size={8}>
            {data.slice(0, displayMaxLength).map((group) => {
              return (
                <Group
                  data={group}
                  key={group.id}
                  active={activeGroupId === group.id}
                  displayTitleMaxLength={displayTitleMaxLength}
                  onClick={() => {
                    setActiveGroupId(
                      activeGroupId === group.id ? "" : group.id,
                    );
                  }}
                />
              );
            })}
            <Button
              size={"small"}
              type={"text"}
              onClick={() => setModalOpen(true)}
            >
              <SettingOutlined />
            </Button>
          </Space>
        </Space>
      )}
      <MessageConfigsPanelModalWrapper
        open={modalOpen}
        onOpenChange={setModalOpen}
        data={data}
        onChange={onChange}
        tableHeight={tableHeight}
        limitation={limitation}
      />
    </>
  );
};

const GroupWrapper = styled.div<{
  $textColor: string;
  $backgroundColor: string;
  $hoverColor: string;
  $active: boolean;
}>`
  background-color: ${(p) => p.$backgroundColor};
  color: ${(p) => p.$textColor};
  border: 1px solid transparent;
  border-color: ${(p) => (p.$active ? "#ccc" : "transparent")};
  padding: 0px 4px;
  font-size: 14px;
  border-radius: 2px;
  cursor: pointer;
  min-width: 20px;
  user-select: none;
  &:hover {
    background-color: ${(p) => p.$hoverColor};
  }
  &:active {
    opacity: 0.6;
  }
`;
function Group(props: {
  data: MessagesGroupType;
  active: boolean;
  displayTitleMaxLength: number;
  onClick: () => void;
}) {
  const colors = useMemo(() => {
    const c = Color(props.data.color);
    const isDark = c.isDark();
    const hoverBg = isDark ? c.lighten(0.2)?.hex() : c.darken(0.15)?.hex();

    return {
      $textColor: isDark ? "#fff" : "#333",
      $backgroundColor: props.data.color,
      $hoverColor: hoverBg,
    };
  }, [props.data.color]);

  return (
    <GroupWrapper
      {...colors}
      $active={props.active}
      data-id={props.data.id}
      onClick={props.onClick}
      title={props.data.title}
    >
      {limitText(props.data.title, props.displayTitleMaxLength)}
    </GroupWrapper>
  );
}

export default QuickMessages;

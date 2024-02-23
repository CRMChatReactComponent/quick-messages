import { ReactElement } from "react";

export type MessagesRecordType = {
  /**
   * 标签显示内容
   */
  label: string;
  /**
   * 实际发出内容
   */
  content: string;
};

export type MessagesGroupType = {
  id: string;
  /**
   * group 的背景色
   */
  color: string;
  /**
   * group 名称
   */
  title: string;
  /**
   * 快捷消息数组
   */
  data: MessagesRecordType[];
};

export type SlotType = (props: {
  message: MessagesRecordType;
  group: MessagesGroupType | undefined;
}) => ReactElement | null;

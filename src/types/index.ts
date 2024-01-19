import { ReactElement } from "react";

export type MessagesRecordType = {
  label: string;
  content: string;
};

export type MessagesGroupType = {
  id: string;
  color: string;
  title: string;
  data: MessagesRecordType[];
};

export type SlotType = (props: {
  message: MessagesRecordType;
  group: MessagesGroupType | undefined;
}) => ReactElement | null;

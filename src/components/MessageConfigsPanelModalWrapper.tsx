import { FC, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "antd";
import { MessageConfigsPanelProps } from "@/components/MessageConfigsPanel";
import MessageConfigsPanel from "./MessageConfigsPanel";

type MessageConfigsPanelDrawerWrapperProps = {
  open?: boolean;
  onOpenChange?: (bool: boolean) => void;
  children?: ReactNode;
} & MessageConfigsPanelProps;

const MessageConfigsPanelModalWrapper: FC<
  MessageConfigsPanelDrawerWrapperProps
> = ({ open: _open, onOpenChange = () => {}, children, ...resetOptions }) => {
  const [open, setOpen] = useState(_open);
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(!!_open);
  }, [_open]);

  return (
    <>
      <Modal
        title={t("quickMessageConfigs")}
        open={open}
        onCancel={() => {
          setOpen(false);
          onOpenChange(false);
        }}
        width={980}
        footer={null}
      >
        <MessageConfigsPanel {...resetOptions} />
      </Modal>
      <span
        onClick={() => {
          setOpen(true);
          onOpenChange(true);
        }}
      >
        {children}
      </span>
    </>
  );
};

export default MessageConfigsPanelModalWrapper;

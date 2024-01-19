import { useState } from "react";
import { Button } from "antd";
import MessageConfigsPanelModalWrapper from "../components/MessageConfigsPanelModalWrapper";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof MessageConfigsPanelModalWrapper> = {
  title: "MessageConfigsPanelDrawerWrapper",
  component: MessageConfigsPanelModalWrapper,
  args: {
    onChange: fn(),
  },
  render(props) {
    const [data, setData] = useState(props.data);
    const [open, setOpen] = useState(props.open ?? false);

    function handleChanged(data) {
      setData(data);
      props?.onChange?.(data);
    }

    return (
      <div style={{ width: 1200 }}>
        <MessageConfigsPanelModalWrapper
          {...props}
          data={data}
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            props?.onOpenChange?.(open);
          }}
          onChange={handleChanged}
        >
          <Button>点击触发</Button>
        </MessageConfigsPanelModalWrapper>
      </div>
    );
  },
};

type Story = StoryObj<typeof MessageConfigsPanelModalWrapper>;

export const Default: Story = {
  args: {
    // data: [{ label: "a", content: "b" }],
  },
};

export const WithData: Story = {
  args: {
    data: [
      {
        id: "foo",
        title: "bar",
        color: "#f20",
        data: [
          {
            label: "foo",
            content: "bar",
          },
        ],
      },
    ],
  },
};

export default meta;

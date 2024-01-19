import { useState } from "react";
import { Button } from "antd";
import { omit } from "lodash-es";
import MessageConfigsPanel from "../components/MessageConfigsPanel";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof MessageConfigsPanel> = {
  title: "MessageConfigsPanel",
  component: MessageConfigsPanel,
  args: {
    onChange: fn(),
  },
  render(props) {
    const [data, setData] = useState(props.data);

    function handleChanged(data) {
      setData(data);
      props?.onChange?.(data);
    }

    return (
      <div style={{ width: 1200 }}>
        <MessageConfigsPanel data={data} onChange={handleChanged} />
      </div>
    );
  },
};

type Story = StoryObj<typeof MessageConfigsPanel>;

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

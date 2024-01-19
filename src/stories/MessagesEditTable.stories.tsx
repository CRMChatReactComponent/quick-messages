import { useState } from "react";
import { Button } from "antd";
import { omit } from "lodash-es";
import MessagesEditTable from "../components/MessagesEditTable";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof MessagesEditTable> = {
  title: "MessagesEditTable",
  component: MessagesEditTable,
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
      <div style={{ width: 900 }}>
        <MessagesEditTable data={data} onChange={handleChanged} />
      </div>
    );
  },
};

type Story = StoryObj<typeof MessagesEditTable>;

export const Default: Story = {
  args: {
    // data: [{ label: "a", content: "b" }],
  },
};

export const WithData: Story = {
  args: {
    data: [{ label: "foo", content: "bar" }],
  },
};

export default meta;

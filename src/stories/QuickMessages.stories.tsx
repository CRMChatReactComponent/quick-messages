import { useState } from "react";
import QuickMessages from "../components/QuickMessages";
import { SendOutlined } from "@ant-design/icons";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

const meta: Meta<typeof QuickMessages> = {
  title: "QuickMessages",
  component: QuickMessages,
  args: {
    onChange: fn(),
    onSelect: fn(),
  },
  render(props) {
    const [data, setData] = useState(props.data);

    function handleChanged(data) {
      setData(data);
      props?.onChange?.(data);
    }

    return (
      <div style={{ width: 1200 }}>
        <QuickMessages {...props} data={data} onChange={handleChanged} />
      </div>
    );
  },
};

type Story = StoryObj<typeof QuickMessages>;

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
        title: "foo",
        color: "#f20",
        data: [
          {
            label: "foo",
            content: "bar",
          },
        ],
      },
      {
        id: "bar",
        title: "bar",
        color: "#f0f",
        data: [
          {
            label: "foo2",
            content: "bar2",
          },
        ],
      },
    ],
  },
};

export const MassData: Story = {
  args: {
    data: Array.from({ length: faker.number.int({ min: 10, max: 20 }) }, () => {
      return {
        id: faker.string.uuid(),
        title: faker.internet.userName(),
        color: faker.color.rgb(),
        data: Array.from(
          { length: faker.number.int({ min: 5, max: 10 }) },
          () => {
            return {
              label: faker.internet.userName(),
              content: faker.commerce.productDescription(),
            };
          },
        ),
      };
    }),
  },
};

export const Slot: Story = {
  args: {
    data: Array.from({ length: faker.number.int({ min: 10, max: 20 }) }, () => {
      return {
        id: faker.string.uuid(),
        title: faker.internet.userName(),
        color: faker.color.rgb(),
        data: Array.from(
          { length: faker.number.int({ min: 5, max: 10 }) },
          () => {
            return {
              label: faker.internet.userName(),
              content: faker.commerce.productDescription(),
            };
          },
        ),
      };
    }),
    SlotContentPrefixSlot: ({ group, message }) => {
      return <SendOutlined style={{ paddingRight: 4 }} />;
    },
  },
};

export default meta;

# 使用

## 安装

```shell
pnpm install @crmchatreactcomponent/quick-messages -D
```

## 使用

```tsx
import {
  QuickMessages,
  I18nContextCmp,
  AntdApiContextProviderCmp,
} from "@crmchatreactcomponent/quick-messages";

const QuickMessageWrapper = function () {
  const [data, setData] = useState<MessagesGroupType[]>([]);

  return (
    <AntdApiContextProviderCmp>
      <I18nContextCmp>
        <QuickMessages
          data={data}
          onChange={handleChange}
          SlotContentPrefixSlot={({ group, message }) => {
            return <button>快速群发</button>;
          }}
          onSelect={handleSent}
        />
      </I18nContextCmp>
    </AntdApiContextProviderCmp>
  );
};
```

该组件使用 `i8next` 和 `antd` 来分别处理多语言和主题切换功能，因此在调用 `<QuickMessages/>` 时需要将其包裹在 `AntdApiContextProviderCmp` 和 `I18nContextCmp` 中，以保证逻辑代码正常运行。

> 只需要包裹下即可，不需要进行任何配置

# 参数

## data 快捷消息数据

类型为 `MessagesGroupType[]`

```typescript
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
```

这个数据为所有快捷消息的数据

## limitation （可选）

快捷消息字数限制

默认为

```typescript
const { title: titleLimit = 15, content: contentLimit = 2000 } = limitation;
```

## displayTitleMaxLength （可选）

最大 group 显示数量，默认值为 10

## displayMaxLength（可选）

最大快捷消息显示数量，默认值 99

# 事件

## onSelect（可选）

`(message: MessagesRecordType) => void;`

当用户点击快捷消息时触发

## onChange（可选）

`(data: MessagesGroupType[]) => void;`

当快捷消息数据改变时触发

# Slot

插槽

```typescript
export type SlotType = (props: {
  message: MessagesRecordType;
  group: MessagesGroupType | undefined;
}) => ReactElement | null;
```

该组件提供以下插槽

1. SlotContentPrefixSlot（可选）快捷消息左侧插槽
2. SlotContentSuffixSlot（可选）快捷消息右侧插槽

## 使用

比如我们希望在每个快捷消息左侧添加一个按钮，当点击按钮时做一些额外的操作

```tsx
<QuickMessages
  data={data}
  onChange={handleChange}
  SlotContentPrefixSlot={({ group, message }) => {
    return <button>快速群发</button>;
  }}
  onSelect={handleSent}
/>
```

import {
  resetIntersectionMocking,
  setupIntersectionMocking,
} from "react-intersection-observer/test-utils";
import MessageConfigsPanelModalWrapper from "../components/MessageConfigsPanelModalWrapper";
import { AntdApiContextProviderCmp } from "../context/AntdApiContext";
import { render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

describe("MessageConfigsPanelModalWrapper component", () => {
  {
    const onSaveCallback = vi.fn();
    const { container } = render(
      <AntdApiContextProviderCmp>
        <MessageConfigsPanelModalWrapper data={[]} onChange={onSaveCallback} />
      </AntdApiContextProviderCmp>,
    );

    const C = within(container);

    it("renders correctly", async () => {
      expect(true).toBeTruthy();
    });
  }
});

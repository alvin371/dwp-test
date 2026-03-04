"use client";

import { ConfigProvider, App } from "antd";
import type { FC, PropsWithChildren, ReactElement } from "react";

const telcoTheme = {
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

export const AntdProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  return (
    <ConfigProvider theme={telcoTheme}>
      <App>{children}</App>
    </ConfigProvider>
  );
};

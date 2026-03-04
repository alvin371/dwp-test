"use client";

import type { FC, PropsWithChildren, ReactElement } from "react";
import { ReactQueryProvider } from "@/libs/react-query/react-query-provider";
import { AntdProvider } from "./antd-provider";

export const ClientProviders: FC<PropsWithChildren> = ({ children }): ReactElement => {
  return (
    <ReactQueryProvider>
      <AntdProvider>{children}</AntdProvider>
    </ReactQueryProvider>
  );
};

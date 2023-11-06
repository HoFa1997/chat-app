"use client";
import { ReactNode } from "react";

type Props = { children: ReactNode | ReactNode[] };

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  return <>{children}</>;
};


import React from "react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="container max-w-[960px] mx-auto px-4">{children}</div>
  );
}

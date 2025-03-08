import React from "react";
import { Skeleton } from "antd";

export default function LoadingSkeleton() {
  return <Skeleton avatar paragraph={{ rows: 2 }} />;
}

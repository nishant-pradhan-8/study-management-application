import React from "react";
import ContentLoader from "react-content-loader";
import  { IContentLoaderProps } from "react-content-loader";
const FolderLoader: React.FC<IContentLoaderProps> = (props) => {
  return (
    <>
      <ContentLoader
        uniqueKey="my-random-value"
        viewBox="0 0 462 80"
        height={80}
        width={462}
        {...props}
      >
        <rect x="90" y="16" rx="5" ry="5" width="321" height="15" />
        <rect x="129" y="39" rx="5" ry="5" width="220" height="9" />
        <rect x="26" y="10" rx="0" ry="0" width="50" height="45" />
        <rect x="13" y="54" rx="0" ry="0" width="0" height="0" />
        <rect x="13" y="50" rx="0" ry="0" width="0" height="0" />
      </ContentLoader>
      <ContentLoader
        uniqueKey="my-random-value"
        viewBox="0 0 462 80"
        height={80}
        width={462}
        {...props}
      >
        <rect x="90" y="16" rx="5" ry="5" width="321" height="15" />
        <rect x="129" y="39" rx="5" ry="5" width="220" height="9" />
        <rect x="26" y="10" rx="0" ry="0" width="50" height="45" />
        <rect x="13" y="54" rx="0" ry="0" width="0" height="0" />
        <rect x="13" y="50" rx="0" ry="0" width="0" height="0" />
      </ContentLoader>
      <ContentLoader
        uniqueKey="my-random-value"
        viewBox="0 0 462 80"
        height={80}
        width={462}
        {...props}
      >
        <rect x="90" y="16" rx="5" ry="5" width="321" height="15" />
        <rect x="129" y="39" rx="5" ry="5" width="220" height="9" />
        <rect x="26" y="10" rx="0" ry="0" width="50" height="45" />
        <rect x="13" y="54" rx="0" ry="0" width="0" height="0" />
        <rect x="13" y="50" rx="0" ry="0" width="0" height="0" />
      </ContentLoader>
      <ContentLoader
        uniqueKey="my-random-value"
        viewBox="0 0 462 80"
        height={80}
        width={462}
        {...props}
      >
        <rect x="90" y="16" rx="5" ry="5" width="321" height="15" />
        <rect x="129" y="39" rx="5" ry="5" width="220" height="9" />
        <rect x="26" y="10" rx="0" ry="0" width="50" height="45" />
        <rect x="13" y="54" rx="0" ry="0" width="0" height="0" />
        <rect x="13" y="50" rx="0" ry="0" width="0" height="0" />
      </ContentLoader>
    </>
  );
};

export default FolderLoader;

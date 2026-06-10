export type TBreadcrumbItem = {
  label: string;
  href: string;
  clickable: boolean;
  isCurrent: boolean;
};

export type BreadcrumbContextProps = {
  breadcrumbs: Array<TBreadcrumbItem>;
  setCustomLabel: (path: string, label: string) => void;
  customBuildBreadcrumbs: (pathname: string, blockedPaths?: Array<string>) => void;
}
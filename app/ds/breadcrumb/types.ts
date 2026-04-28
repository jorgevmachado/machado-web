export type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrent: boolean;
};

export type BreadcrumbContextProps = {
  setCustomLabel: (path: string, label: string) => void;
  customLabels: Record<string, string>;
}
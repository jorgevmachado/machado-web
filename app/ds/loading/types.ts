export type LoadingContextValue = {
  isPageLoading: boolean;
  isContentLoading: boolean;
  startPageLoading: () => void;
  stopPageLoading: () => void;
  startContentLoading: () => void;
  stopContentLoading: () => void;
};


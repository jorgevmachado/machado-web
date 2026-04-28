/**
 * Barrel coverage test: imports everything from the ds/index.ts barrel so that
 * all re-export statements (and transitively the component index.ts files) are
 * executed by at least one test run.
 *
 * This file does NOT test behaviour — it only ensures the barrel module graph
 * is traversed by the coverage reporter.
 */
import {
  Alert,
  AlertProvider,
  useAlert,
  Autocomplete,
  Badge,
  BarChart,
  Breadcrumb,
  BreadcrumbProvider,
  buildBreadcrumbs,
  ROUTE_SEGMENT_LABELS,
  useBreadcrumb,
  Button,
  Card,
  Filters,
  Image,
  Input,
  Loading,
  LoadingProvider,
  useLoading,
  Modal,
  useModal,
  Pagination,
  Text,
} from '@/app/ds';

describe('app/ds barrel exports', () => {
  it('exports all expected symbols', () => {
    // Component constructors / render functions
    expect(Alert).toBeDefined();
    expect(AlertProvider).toBeDefined();
    expect(useAlert).toBeDefined();
    expect(Autocomplete).toBeDefined();
    expect(Badge).toBeDefined();
    expect(BarChart).toBeDefined();
    expect(Breadcrumb).toBeDefined();
    expect(BreadcrumbProvider).toBeDefined();
    expect(buildBreadcrumbs).toBeDefined();
    expect(ROUTE_SEGMENT_LABELS).toBeDefined();
    expect(useBreadcrumb).toBeDefined();
    expect(Button).toBeDefined();
    expect(Card).toBeDefined();
    expect(Filters).toBeDefined();
    expect(Image).toBeDefined();
    expect(Input).toBeDefined();
    expect(Loading).toBeDefined();
    expect(LoadingProvider).toBeDefined();
    expect(useLoading).toBeDefined();
    expect(Modal).toBeDefined();
    expect(useModal).toBeDefined();
    expect(Pagination).toBeDefined();
    expect(Text).toBeDefined();
  });
});

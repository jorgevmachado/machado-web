type WithoutUndefinedValues<T extends Record<string, unknown>> = Partial<{
  [K in keyof T]: Exclude<T[K], undefined>;
}>;

export const omitUndefined = <T extends Record<string, unknown>>(
  obj: T,
): WithoutUndefinedValues<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as WithoutUndefinedValues<T>;
};

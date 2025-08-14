// TODO: Remove this when releasing 1.0 (Replace for () => true)
export function defaultValidatorFunction(
  page: number,
  pageSize: number
): boolean {
  if (page < 1) {
    return false;
  }

  if (pageSize < 1) {
    return false;
  }

  return true;
}

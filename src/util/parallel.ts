/**
 * Processes a list of asynchronous functions in batches.
 * 
 * @param asyncFnList 
 * @param clusterSize 
 * @returns 
 */
export async function parallel<T>(asyncFnList: (() => Promise<T>)[], clusterSize = asyncFnList.length): Promise<T[]> {
  const results: T[] = [];
  while(asyncFnList.length > 0) {
    const currentFns = asyncFnList.splice(0, clusterSize);
    const currentPromises = currentFns.map((fn) => fn());
    // todo - all settled?
    const clusterResults = await Promise.all(currentPromises);
    results.push(...clusterResults);
  }

  return results;
}
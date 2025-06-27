"use client"

/**
 * Checks if a value is "empty" (null, undefined, empty string, empty array, or empty object with no keys).
 * @param value The value to check.
 * @returns True if the value is empty, false otherwise.
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined || value === "") {
    return true
  }
  if (Array.isArray(value) && value.length === 0) {
    return true
  }
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) {
    return true
  }
  return false
}

/**
 * Recursively removes empty values from an object or an array of objects.
 * This function is essential for cleaning the form state before generating the final manifest,
 * ensuring that optional fields left blank by the user are not included in the output.
 * @param obj The object or array to prune.
 * @returns A new object or array with all empty values removed.
 */
export function pruneEmpty<T>(obj: T): T {
  if (Array.isArray(obj)) {
    // If it's an array, map over it and prune each item.
    // Then, filter out any items that have become empty after pruning.
    return obj
      .map(item => pruneEmpty(item))
      .filter(item => !isEmpty(item)) as T
  }

  if (typeof obj === "object" && obj !== null) {
    // If it's an object, create a new object and copy over only the non-empty values.
    const newObj = {} as T
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Recursively prune the value first.
        const value = pruneEmpty(obj[key])
        
        // If the pruned value is not empty, add it to the new object.
        if (!isEmpty(value)) {
          newObj[key] = value
        }
      }
    }
    return newObj
  }

  // If it's not a primitive, object or array, return it as is.
  return obj
} 
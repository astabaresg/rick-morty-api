import logger from "../../config/logger";

/**
 * Decorator that logs the execution time of a method.
 * @param target - The target object.
 * @param propertyKey - The name of the method being decorated.
 * @param descriptor - The property descriptor of the method being decorated.
 * @returns The modified property descriptor.
 */
export function logExecutionTime(
  target: any,
  propertyKey: any,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = Date.now();
    const result = await originalMethod.apply(this, args);
    const end = Date.now();
    const executionTime = end - start;

    logger.info(`Execution time for ${propertyKey}: ${executionTime}ms`);
    return result;
  };

  return descriptor;
}

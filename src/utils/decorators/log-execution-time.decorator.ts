import logger from "../../config/logger";

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

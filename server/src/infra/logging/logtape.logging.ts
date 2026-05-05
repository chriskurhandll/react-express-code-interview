import { getLogger } from "@logtape/logtape";
import { Logger } from "@react-express-code-interview/shared";


export function createAppLogger(...subcategories: string[]): Logger {
  const lt = getLogger(["app", ...subcategories]);
  return {
    debug: (message, props) => lt.debug(message, props ?? {}),
    info: (message, props) => lt.info(message, props ?? {}),
    warn: (message, props) => lt.warn(message, props ?? {}),
    error: (message, props) => lt.error(message, props ?? {}),
  };
}

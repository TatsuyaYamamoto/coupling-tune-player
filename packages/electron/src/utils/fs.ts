import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";

export const readFileRecursively = async (
  fileOrDirPath: string
): Promise<string[]> => {
  const stats = await promisify(fs.stat)(fileOrDirPath);

  if (stats.isFile()) {
    return [fileOrDirPath];
  }

  if (stats.isDirectory()) {
    const relativePaths = await promisify(fs.readdir)(fileOrDirPath);
    const absolutePaths = relativePaths.map(p => path.join(fileOrDirPath, p));

    const pathsList = await Promise.all(
      absolutePaths.map(path => readFileRecursively(path))
    );

    return pathsList.flat();
  }

  throw new Error(`unsupported file type: ${path}`);
};

import { access, mkdir } from 'node:fs/promises';
import { parse } from 'node:path';

/**
 * Creates the output directory asynchronously if it does not already exist.
 *
 * @param {string} outputDir - The path of the output directory.
 * @returns {Promise<void>} - A promise that resolves when the output directory is created.
 */
export async function createOutputDir(outputDir: string) {
  try {
    await access(outputDir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await mkdir(outputDir, { recursive: true });
    } else {
      throw error;
    }
  }
}

/**
 * Generates the output filename for a compressed image.
 *
 * @param {string} filePath - The file path to the original image.
 * @param {Partial<ImageCompressingOptions>} [options={}] - Optional settings for the image compression.
 * @returns {string} - The generated output filename for the compressed image.
 */
export function generateOutputFilename(
  filePath: string,
  options: Partial<ImageCompressingOptions> = {},
) {
  const { name, ext } = parse(filePath);
  const { outputFilenameSuffix, format } = options;
  return `${name}${
    outputFilenameSuffix?.length ? `-${outputFilenameSuffix}` : ''
  }${format?.length ? `.${format}` : ext}`;
}

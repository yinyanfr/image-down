/**
 * MIT License
 * Copyright (c) 2023 Yan
 */

import { readFile, writeFile } from 'node:fs/promises';
import sharp, { type AvailableFormatInfo, type FormatEnum } from 'sharp';
import { join } from 'node:path';
import { createOutputDir, generateOutputFilename } from '../lib';

/**
 * Compresses a single image asynchronously.
 *
 * @param {string} filePath - The file path to the image.
 * @param {Partial<ImageCompressingOptions>} [options={}] - Optional settings for image compression.
 * @returns {Promise<Buffer | void>} - A promise that resolves to the compressed image buffer or void.
 */
export async function compressImage(
  filePath: string,
  options: Partial<ImageCompressingOptions> = {},
) {
  const { percentage, width, height, format, outputDir, returnBuffers } =
    options;

  if (outputDir) {
    await createOutputDir(outputDir);
  }

  const filename = generateOutputFilename(filePath, options);
  const fileBuffer = await readFile(filePath);
  const image = sharp(fileBuffer);
  const metadata = await image.metadata();
  let compressed = await image.resize({
    width:
      width ??
      (percentage && metadata.width
        ? Math.ceil(metadata.width * (percentage / 100))
        : 800),
    height,
  });
  if (format) {
    compressed = compressed.toFormat(
      format as keyof FormatEnum | AvailableFormatInfo,
    );
  }
  const compressedBuffer = await compressed.toBuffer();
  if (outputDir) {
    const outputPath = join(outputDir, filename);
    await writeFile(outputPath, compressedBuffer);
  }
  if (returnBuffers) {
    return compressedBuffer;
  }
}

/**
 * Compresses the given images asynchronously.
 *
 * @param {string[]} filePaths - An array of file paths to the images.
 * @param {Partial<ImageCompressingOptions>} [options={}] - Optional settings for image compression.
 * @returns {Promise<ImageCompressProgress[] | void>} - A promise that resolves to an array of compressed image buffers or void.
 */
export async function compressImages(
  filePaths: string[],
  options: Partial<ImageCompressingOptions> = {},
) {
  const { outputDir, returnBuffers, onProgress } = options;
  const fileBuffers: ImageCompressProgress[] = [];
  const total = filePaths.length;

  if (outputDir) {
    await createOutputDir(outputDir);
  }

  for (let queueIndex = 0; queueIndex < total; queueIndex++) {
    const filePath = filePaths[queueIndex];
    const filename = generateOutputFilename(filePath, options);
    try {
      const compressedBuffer = await compressImage(filePath, options);
      if (returnBuffers) {
        fileBuffers.push({ filePath, fileBuffer: compressedBuffer });
      }
      onProgress?.({
        filePath,
        fileBuffer: compressedBuffer,
        progress: {
          queueIndex,
          total,
          filename,
          status: 'success',
        },
      });
    } catch (error) {
      console.error(error);
      onProgress?.({
        filePath,
        progress: {
          queueIndex,
          total,
          filename,
          status: 'failed',
        },
      });
    }
  }
  if (returnBuffers) {
    return fileBuffers;
  }
}

/**
 * MIT License
 * Copyright (c) 2023 Yan
 */

import { readFile, writeFile } from 'node:fs/promises';
import sharp, { type AvailableFormatInfo, type FormatEnum } from 'sharp';
import { join, parse } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

export async function compressImages(
  filePaths: string[],
  options: Partial<ImageCompressingOptions> = {},
) {
  const {
    percentage,
    width,
    height,
    format,
    outputDir,
    outputFilenameSuffix,
    returnBuffers,
    onProgress,
  } = options;
  const fileBuffers: ImageCompressProgress[] = [];
  const total = filePaths.length;
  if (outputDir) {
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
  }
  for (let queueIndex = 0; queueIndex < total; queueIndex++) {
    const filePath = filePaths[queueIndex];
    const { name, ext } = parse(filePath);
    const filename = `${name}${
      outputFilenameSuffix?.length ? `-${outputFilenameSuffix}` : ''
    }${format?.length ? `.${format}` : ext}`;
    try {
      const fileBuffer = await readFile(filePath);
      const image = sharp(fileBuffer);
      const metadata = await image.metadata();
      let compressed = await image.resize({
        width:
          width ??
          (percentage && metadata.width
            ? (metadata.width * percentage) / 100
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

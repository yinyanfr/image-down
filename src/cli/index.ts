#!/usr/bin/env node

/**
 * MIT License
 * Copyright (c) 2023 Yan
 */

import args from 'args';
import { compressImages } from '../lib';
import ora from 'ora';

args
  .option('percentage', 'Resize images according to the width by percentage.')
  .option('width', 'Resize images to a certain width.')
  .option('height', 'Resize images to a certain height.')
  .option('format', 'Convert images to a format.')
  .option('suffix', 'Adding a suffix to the output filename.')
  .option('output', "Specify the output directory, default to '.'.")
  .example(
    'npx image-down images/* --width 800 --format jpg --suffix min --output compressed',
    "Compressing all files from folder images to jpg with widths of 800px and add '-min' to converted filenames, saving all compressed images to folder compressed.",
  );

const flags = args.parse(process.argv);
const subs = args.sub;

const {
  percentage,
  width,
  height,
  format,
  suffix: outputFilenameSuffix,
  output: outputDir = '.',
} = flags;

if (!subs?.length) {
  throw new Error('Please specify image paths.');
}

compressImages(subs, {
  percentage,
  width,
  height,
  format,
  outputDir,
  outputFilenameSuffix,
  onProgress({ progress }) {
    if (progress?.status === 'success') {
      ora(`Saved ${progress.filename}`).succeed();
    } else {
      ora(`Failed ${progress?.filename}`).fail();
    }
  },
});

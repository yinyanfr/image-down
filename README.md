# image-down

[![npm](https://img.shields.io/npm/v/image-down.svg?style=flat-square)](https://www.npmjs.com/package/image-down)
![license](https://img.shields.io/npm/l/image-down.svg?style=flat-square)
![size](https://img.shields.io/github/repo-size/yinyanfr/image-down?style=flat-square)
[![GitHub release](https://img.shields.io/github/release/yinyanfr/image-down.svg?style=flat-square)](https://github.com/yinyanfr/image-down/releases/latest)

Yet another CLI tool to batch compress / downscale images.

## :green_book: Quick Start

```bash
npx image-down images/* --width 800 --output compressed
```

```typescript
import { compressImages } from 'image-down';

// Wildcards are not supported in library usages
await compressImages(['./images/image1.jpg'], {
  width: 800,
  outputDir: 'compressed',
});
```

## :wrench: Cli

```bash
Usage: npx image-down [options]

Commands:
  help     Display help
  version  Display version

Options:
  -f, --format      Convert images to a format.
  -h, --height      Resize images to a certain height.
  -H, --help        Output usage information
  -o, --output      Specify the output directory, default to '.'.
  -p, --percentage  Resize images according to the width by percentage.
  -s, --suffix      Adding a suffix to the output filename.
  -v, --version     Output the version number
  -w, --width       Resize images to a certain width.

Examples:
  - Compressing all files from folder images to jpg with widths of 800px and add '-min' to converted filenames, saving all compressed images to folder compressed.
  $ npx image-down images/* --width 800 --format jpg --suffix min --output compressed
```

## :book: Library

```typescript
await compressImages(pathsArray, options);
```

### Options

| Name                 | Type     | Description                                                    |
| -------------------- | -------- | -------------------------------------------------------------- |
| percentage           | number   | Resize images according to the width by percentage.            |
| width                | number   | Resize images to a certain width.                              |
| height               | number   | Resize images to a certain height.                             |
| format               | number   | Convert images to a format.                                    |
| outputDir            | string   | Specify the output directory, will not output if not defined.  |
| outputFilenameSuffix | string   | Adding a suffix to the output filename.                        |
| returnBuffers        | boolean  | Returning all converted buffers with corresponding file paths. |
| onProgress           | Function | A function that is called when each file is processed.         |

#### onProgress

| Name                | Type   | Description                    |
| ------------------- | ------ | ------------------------------ |
| filePath            | string | The original path to the file. |
| fileBuffer          | Buffer | The converted file buffer.     |
| progress            | Object | The progress object.           |
| progress.queueIndex | number | File index.                    |
| progress.total      | number | Queue length.                  |
| progress.status     | string | "success" or "failed.          |
| progress.filename   | string | The name of the output file.   |

### Completed Example

```typescript
/**
 * Compressing all files from folder images to jpg with widths of 800px
 * and add '-min' to converted filenames,
 * saving all compressed images to folder compressed.
 */

import { glob } from 'glob';
import { compressImages } from 'image-down';

const filePaths = await glob('images/*');
await compressImages(filePaths, {
  width: 800,
  format: 'jpg',
  suffix: 'min',
  output: './compressed',
  onProgress({ progress }) {
    console.log(`Saved ${progress.filename}.`);
  },
});
```

interface ImageCompressProgress {
  filePath: string;
  fileBuffer?: Buffer;
  progress?: {
    queueIndex: number;
    total: number;
    status: 'success' | 'failed';
    filename: string;
  };
}

interface ImageCompressingOptions {
  percentage?: number;
  width?: number;
  height?: number;
  format?: string;
  outputDir?: string;
  outputFilenameSuffix?: string;
  returnBuffers?: boolean;
  onProgress?: (params: ImageCompressProgress) => void;
}

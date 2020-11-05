/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 * 
 * Note (@gzuidhof): Despite the warning above, I added the Cell typedef below..
 */

export type Output = Pyout | DisplayData | Stream | Pyerr;
export type Cell = RawCell | MarkdownCell | HeadingCell | CodeCell;

/**
 * IPython Notebook v3.0 JSON schema.
 */
export interface Demo {
  /**
   * Notebook root-level metadata.
   */
  metadata: {
    /**
     * Kernel information.
     */
    kernel_info?: {
      /**
       * Name of the kernel specification.
       */
      name: string;
      /**
       * The programming language which this kernel runs.
       */
      language: string;
      /**
       * The codemirror mode to use for code in this language.
       */
      codemirror_mode?: string;
      [k: string]: unknown;
    };
    /**
     * Hash of the notebook.
     */
    signature?: string;
    [k: string]: unknown;
  };
  /**
   * Notebook format (minor number). Incremented for backward compatible changes to the notebook format.
   */
  nbformat_minor: number;
  /**
   * Notebook format (major number). Incremented between backwards incompatible changes to the notebook format.
   */
  nbformat: 3;
  /**
   * Original notebook format (major number) before converting the notebook between versions.
   */
  orig_nbformat?: number;
  /**
   * Original notebook format (minor number) before converting the notebook between versions.
   */
  orig_nbformat_minor?: number;
  /**
   * Array of worksheets
   */
  worksheets: Worksheet[];
}
export interface Worksheet {
  /**
   * Array of cells of the current notebook.
   */
  cells: (RawCell | MarkdownCell | HeadingCell | CodeCell)[];
  /**
   * metadata of the current worksheet
   */
  metadata?: {
    [k: string]: unknown;
  };
}
/**
 * Notebook raw nbconvert cell.
 */
export interface RawCell {
  /**
   * String identifying the type of cell.
   */
  cell_type: "raw";
  /**
   * Cell-level metadata.
   */
  metadata?: {
    /**
     * Raw cell metadata format for nbconvert.
     */
    format?: string;
    /**
     * The cell's name. If present, must be a non-empty string.
     */
    name?: string;
    /**
     * The cell's tags. Tags must be unique, and must not contain commas.
     */
    tags?: string[];
    [k: string]: unknown;
  };
  /**
   * Contents of the cell, represented as an array of lines.
   */
  source: string | string[];
}
/**
 * Notebook markdown cell.
 */
export interface MarkdownCell {
  /**
   * String identifying the type of cell.
   */
  cell_type: "markdown" | "html";
  /**
   * Cell-level metadata.
   */
  metadata?: {
    /**
     * The cell's name. If present, must be a non-empty string.
     */
    name?: string;
    /**
     * The cell's tags. Tags must be unique, and must not contain commas.
     */
    tags?: string[];
    [k: string]: unknown;
  };
  /**
   * Contents of the cell, represented as an array of lines.
   */
  source: string | string[];
}
/**
 * Notebook heading cell.
 */
export interface HeadingCell {
  /**
   * String identifying the type of cell.
   */
  cell_type: "heading";
  /**
   * Cell-level metadata.
   */
  metadata?: {
    [k: string]: unknown;
  };
  /**
   * Contents of the cell, represented as an array of lines.
   */
  source: string | string[];
  /**
   * Level of heading cells.
   */
  level: number;
}
/**
 * Notebook code cell.
 */
export interface CodeCell {
  /**
   * String identifying the type of cell.
   */
  cell_type: "code";
  /**
   * The cell's language (always Python)
   */
  language: string;
  /**
   * Whether the cell is collapsed/expanded.
   */
  collapsed?: boolean;
  /**
   * Cell-level metadata.
   */
  metadata?: {
    [k: string]: unknown;
  };
  /**
   * Contents of the cell, represented as an array of lines.
   */
  input: string | string[];
  /**
   * Execution, display, or stream outputs.
   */
  outputs: Output[];
  /**
   * The code cell's prompt number. Will be null if the cell has not been run.
   */
  prompt_number?: number | null;
}
/**
 * Result of executing a code cell.
 */
export interface Pyout {
  /**
   * Type of cell output.
   */
  output_type: "pyout";
  /**
   * A result's prompt number.
   */
  //@ts-ignore
  prompt_number: number;
  text?: string | string[];
  latex?: string | string[];
  png?: string | string[];
  jpeg?: string | string[];
  svg?: string | string[];
  html?: string | string[];
  javascript?: string | string[];
  json?: string | string[];
  pdf?: string | string[];
  /**
   * Cell output metadata.
   */
  //@ts-ignore
  metadata?: {
    [k: string]: unknown;
  };
  /**
   * mimetype output (e.g. text/plain), represented as either an array of strings or a string.
   *
   * This interface was referenced by `Pyout`'s JSON-Schema definition
   * via the `patternProperty` "^[a-zA-Z0-9]+/[a-zA-Z0-9\-\+\.]+$".
   */
  [k: string]: string | string[];
}
/**
 * Data displayed as a result of code cell execution.
 */
export interface DisplayData {
  /**
   * Type of cell output.
   */
  output_type: "display_data";
  text?: string | string[];
  latex?: string | string[];
  png?: string | string[];
  jpeg?: string | string[];
  svg?: string | string[];
  html?: string | string[];
  javascript?: string | string[];
  json?: string | string[];
  pdf?: string | string[];
  /**
   * Cell output metadata.
   */
  //@ts-ignore
  metadata?: {
    [k: string]: unknown;
  };
  /**
   * mimetype output (e.g. text/plain), represented as either an array of strings or a string.
   *
   * This interface was referenced by `DisplayData`'s JSON-Schema definition
   * via the `patternProperty` "[a-zA-Z0-9]+/[a-zA-Z0-9\-\+\.]+$".
   */
  [k: string]: string | string[];
}
/**
 * Stream output from a code cell.
 */
export interface Stream {
  /**
   * Type of cell output.
   */
  output_type: "stream";
  /**
   * The stream type/destination.
   */
  stream: string;
  /**
   * The stream's text output, represented as an array of strings.
   */
  text: string | string[];
}
/**
 * Output of an error that occurred during code cell execution.
 */
export interface Pyerr {
  /**
   * Type of cell output.
   */
  output_type: "pyerr";
  /**
   * The name of the error.
   */
  ename: string;
  /**
   * The value, or message, of the error.
   */
  evalue: string;
  /**
   * The error's traceback, represented as an array of strings.
   */
  traceback: string[];
}

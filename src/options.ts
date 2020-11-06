export interface JupystarOptions {
    convertLatexBlocks: boolean
}

export const DEFAULT_JUPYSTAR_OPTIONS: JupystarOptions = {
    convertLatexBlocks: true,
}

export function getJupystarOptions(userOptions: Partial<JupystarOptions> = {}): JupystarOptions {
    return {
        ...DEFAULT_JUPYSTAR_OPTIONS,
        ...userOptions
    }
}

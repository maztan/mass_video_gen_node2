export interface IImageGenerator {
    /**
     * @param prompt The prompt text
     * @returns Path to image file
     */
    getImageForPrompt: (prompt: string, outFilePath: string) => void;
    getImagesForPrompts: (prompts: string[]) => any[];
}
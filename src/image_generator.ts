export interface ImageGenerator {
    /**
     * 
     * @param prompt The prompt text
     * @returns Path to image file
     */
    getImageForPrompt: (prompt: string) => string;
    getImagesForPrompts: (prompts: string[]) => any[];
}
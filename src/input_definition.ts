import fs from 'fs';

export interface InputDefinitionEntry {
    /**
     * The prompt to be used to generate image
     */
    imagePrompt: string;
    /**
     * Text to be converted to voice and played when the image is displayed
     */
    textForSpeech: string;
}

export interface InputDefinition {
    Definitions: InputDefinitionEntry[];
}

export abstract class InputDefinitionHelper {
    static loadInputDefinitions(inputFilePath: string): InputDefinition | null {
        try {
            // Read the file synchronously
            const data: string = fs.readFileSync(inputFilePath, 'utf8');
            // Parse the JSON data
            const jsonData: any = JSON.parse(data);
            return jsonData;
        } catch (error) {
            // Handle any errors
            console.error('An error occurred:', error);
            return null;
        }
    }
}
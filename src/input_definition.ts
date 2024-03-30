import fs from 'fs';

export interface IInputDefinitionEntry {
    /**
     * The prompt to be used to generate image
     */
    imagePrompt: string;
    /**
     * Text to be converted to voice and played when the image is displayed
     */
    textForSpeech: string;
}

export class InputDefinitions {
    definitions: IInputDefinitionEntry[] = [];

    [Symbol.iterator]() {
        let index = 0;
        const items = this.definitions;
        return {
            next(): IteratorResult<IInputDefinitionEntry> {
                if (index < items.length) {
                    return { value: items[index++], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
}

export abstract class InputDefinitionHelper {
    static loadInputDefinitions(inputFilePath: string): InputDefinitions | null {
        // Read the file synchronously
        const data: string = fs.readFileSync(inputFilePath, 'utf8');
        // Parse the JSON data
        const jsonData: InputDefinitions = JSON.parse(data);
        return jsonData;
    }
}
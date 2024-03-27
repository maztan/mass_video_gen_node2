import { IImageGenerator } from "./image_generator.js"
import fs from 'fs';
import path from 'path';

export class ImageGeneratorStub implements IImageGenerator {
    getImageForPrompt(prompt: string, outFilePath: string){
        throw new Error("not implemented");
    }

    getImagesForPrompts(prompts: string[]) {
        const inputDir = "input";
        if(!(fs.existsSync(inputDir) && fs.lstatSync(inputDir).isDirectory())){
            return [];
        }
        return this.listFilesSorted(inputDir);
    }

     /**
      * Function to list files in a directory and sort them by name.
     */
    private listFilesSorted(directory: string): string[] {
        // Read directory
        const files = fs.readdirSync(directory);
        
        // Sort files by name
        files.sort((a, b) => a.localeCompare(b));
        
        return files;
    }
}
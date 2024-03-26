import { ImageGenerator } from "./image_generator"

export class ImageGeneratorStub implements ImageGenerator {
    getImageForPrompt(prompt: string){
        return "path to file";
    };
    getImagesForPrompts(prompts: string[]) {
        return ["abc"];
    }
}
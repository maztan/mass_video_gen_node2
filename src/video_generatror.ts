import path from "path";
import { IImageGenerator } from "./image_generator.js";
import { InputDefinitions } from "./input_definition.js";
import { ISpeechSynthesizer } from "./speech_synthesizer.js";


export class VideoGenerator
{
    private readonly audioInputFolder = 'input';
    private readonly imagesInputFolder = 'input';


    async generateVideo(inputDefinitions: InputDefinitions, imageGenerator : IImageGenerator
        , speechSyntheizer: ISpeechSynthesizer){
            let index = 0;

            const audioFilePaths: string[] = [];

            for(const inputDefinition of inputDefinitions){

                // Synthesize text as audio
                let outFile = `${this.audioInputFolder}${path.sep}audio${index}.mp3`;
                console.log(`Saving transcribed audio to ${outFile}`);

                await speechSyntheizer.synthesizeSpeech(inputDefinition.textForSpeech, outFile);
                audioFilePaths.push(outFile);

                // Generate image
                outFile = `${this.imagesInputFolder}${path.sep}image${index}.jpg`;
                imageGenerator.getImageForPrompt(inputDefinition.imagePrompt, outFile);
                index += 1;
            }
    }
}
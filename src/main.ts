import path from "path";
import { FfmpegHelper } from "./ffmpeg_helper.js";
import { IImageGenerator } from "./image_generator.js";
import { ImageGeneratorStub } from "./image_generator_from_local_files.js";
import { InputDefinitionHelper } from "./input_definition.js";
import { ISpeechSynthesizer } from "./speech_synthesizer.js";
import { SpeechSynthesizerAWSPolly } from "./speech_synthesizer_aws_polly.js";


//console.log(inputDefinitions);

async function start(){
    const inputDefinitions = InputDefinitionHelper.loadInputDefinitions("inputDefinition.json");
    if(inputDefinitions === null){
        throw new Error("Input definition could not be found or parsed.");
    }

    const speechSyntheizer: ISpeechSynthesizer = new SpeechSynthesizerAWSPolly();
    const inputAudioFilesPaths: (string|null)[] = [];

    let i=0;
    for(const inputDefinition of inputDefinitions){
        if(inputDefinition.textForSpeech){
            const audioFilePath = path.join('input', `audio${i}.mp3`);
            await speechSyntheizer.synthesizeSpeech(inputDefinition.textForSpeech, audioFilePath);
            inputAudioFilesPaths.push(audioFilePath);
        }else{
            inputAudioFilesPaths.push(null);
        }

        i+=1;
    }

    const inputImageFilesPaths = [];
    for(let i=0; i<(inputDefinitions as any).length; i+=1){
        inputImageFilesPaths.push(`input/image${i}.jpg`)
    }

    await FfmpegHelper.buildFfmpegCommand(inputImageFilesPaths, inputAudioFilesPaths, 'my_out.mp4');

};

start();

//const imageGenerator = new ImageGeneratorStub() as ImageGenerator;

//synthesizeSpeech("Hello Wojciech, Imperator of the 7 continents.", "output/out.mp3");
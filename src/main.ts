import { FfmpegHelper } from "./ffmpeg_helper.js";
import { IImageGenerator } from "./image_generator.js";
import { ImageGeneratorStub } from "./image_generator_from_local_files.js";
import { InputDefinitionHelper } from "./input_definition.js";

//const inputDefinitions = InputDefinitionHelper.loadInputDefinitions("inputDefinition.json");
//console.log(inputDefinitions);

const inputImageFilesPaths = [];
for(let i=0; i<5; i+=1){
    inputImageFilesPaths.push(`input/image${i}.jpg`)
}

FfmpegHelper.buildFfmpegCommand(inputImageFilesPaths,[], 'my_out.mp4');

//const imageGenerator = new ImageGeneratorStub() as ImageGenerator;

//synthesizeSpeech("Hello Wojciech, Imperator of the 7 continents.", "output/out.mp3");
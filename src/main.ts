import { IImageGenerator } from "./image_generator.js";
import { ImageGeneratorStub } from "./image_generator_from_local_files.js";
import { InputDefinitionHelper } from "./input_definition.js";

const inputDefinitions = InputDefinitionHelper.loadInputDefinitions("inputDefinition.json");
console.log(inputDefinitions);
//const imageGenerator = new ImageGeneratorStub() as ImageGenerator;

//synthesizeSpeech("Hello Wojciech, Imperator of the 7 continents.", "output/out.mp3");

export interface ISpeechSynthesizer
{
    synthesizeSpeech(text:string, outFilePath:string): Promise<void>;
}
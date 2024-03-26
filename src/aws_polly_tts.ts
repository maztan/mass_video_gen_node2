import { PollyClient, SynthesizeSpeechCommand, SynthesizeSpeechCommandOutput } from "@aws-sdk/client-polly";
import { Writable } from "stream";
import * as fs from 'fs'

//const command = new ListLexiconsCommand(params);

// Create an Polly client
const pollyClient = new PollyClient({
    //signatureVersion: 'v4',
    region: 'us-east-1'
})

export async function synthesizeSpeech(text:string, outFilePath:string): Promise<void> {
  const command = new SynthesizeSpeechCommand({
    "Engine": "long-form",
    "OutputFormat":"mp3",
    "VoiceId": "Ruth",
    "Text" : text
  });
  
  const response = await pollyClient.send(command);

  const audioStream = response.AudioStream?.transformToWebStream();
  if(audioStream !== undefined){
    await saveFileFromStream(audioStream, outFilePath);
  }
}

function saveFileFromStream(stream: ReadableStream, filePath: string): Promise<void>{
  const fileStream = fs.createWriteStream(filePath);
  // convert node stream to web stream
  const fileWebStream = Writable.toWeb(fileStream);

  return stream.pipeTo(fileWebStream);
}



/*pollyClient.synthesizeSpeech(params, (err: { code: any; }, data: { AudioStream: any; }) => {
    if (err) {
        console.log(err.code)
    } else if (data) {
        if (data.AudioStream instanceof Buffer) {
            Fs.writeFile("./speech.mp3", data.AudioStream, function(err) {
                if (err) {
                    return console.log(err)
                }
                console.log("The file was saved!")
            })
        }
    }
})*/
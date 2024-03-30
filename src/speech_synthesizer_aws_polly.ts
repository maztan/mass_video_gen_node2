import { PollyClient, SynthesizeSpeechCommand, SynthesizeSpeechCommandOutput } from "@aws-sdk/client-polly";
import { Writable } from "stream";
import { ISpeechSynthesizer } from "./speech_synthesizer.js"
import * as fs from 'fs'

//const command = new ListLexiconsCommand(params);

export class SpeechSynthesizerAWSPolly implements ISpeechSynthesizer {
  // Create an Polly client
  private static readonly pollyClient = new PollyClient({
    //signatureVersion: 'v4',
    region: 'us-east-1'
  })

  async synthesizeSpeech(text: string, outFilePath: string): Promise<void> {
    const command = new SynthesizeSpeechCommand({
      "Engine": "long-form",
      "OutputFormat": "mp3",
      "VoiceId": "Ruth",
      "Text": text
    });

    const response = await SpeechSynthesizerAWSPolly.pollyClient.send(command);

    if (response.AudioStream) {
      await response.AudioStream.transformToWebStream().pipeTo(this.createWebStreamToFile(outFilePath));
    }
    /*const audioStream = response.AudioStream?.transformToWebStream();
    if(audioStream !== undefined){
      await this.saveFileFromStream(audioStream, outFilePath);
    }*/

    return Promise.resolve();
  }

  /*async saveFileFromStream(stream: ReadableStream, filePath: string): Promise<void> {
    const fileStream = fs.createWriteStream(filePath);
    // convert node stream to web stream
    const fileWebStream = Writable.toWeb(fileStream);

    await stream.pipeTo(fileWebStream);
    fileWebStream.close();
  }*/

  createWebStreamToFile(filePath: string) {
    const nodeWriteStream = fs.createWriteStream(filePath, "binary");
    nodeWriteStream.write("dupa");
    return new WritableStream({
      write(chunk) {
        nodeWriteStream.write(chunk);
      },
      close() {
        nodeWriteStream.close();
      },
      abort(err) {
        nodeWriteStream.destroy(err);
        throw err;
      },
    });
  }
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

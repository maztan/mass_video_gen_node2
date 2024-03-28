import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path);

export abstract class FfmpegHelper
{
    public static buildFfmpegCommand(
        inputImageFilesPaths: string[],
        inputAudioFilesPaths: (string|null)[],
        //inputFilePath: string,
        outputFilePath: string // this should be an mp4
    ) {

        const complexFilter: string[] = []
        let i = 0;

        //workaround for missing initial apostrophe

        for(const imageFilePath of inputImageFilesPaths){
            let line = `[${i}:v]zoompan=z='min(zoom+0.0015,1.5)':d=10*5:s=1280x720`;
            if(i == 0){
                line += ",fade=t=in:st=0:d=1";
            }
            line += ",fade=t=out:st=9:d=1";
            line += `[v${i}]`;

            complexFilter.push(line);

            i+=1;
        }

        const numPartialOutputs = i;
        let outputDefString = "";
        // concatenate into one output
        for(let i=0; i<numPartialOutputs; i+=1){
            outputDefString += `[v${i}]`;
        }
        
        outputDefString += `concat=n=${numPartialOutputs}:v=1:a=0`;
        outputDefString += ',format=yuv420p[v]'; //"${outputFilePath}

        complexFilter.push(outputDefString);

          
          // Execute ffmpeg command
          ffmpeg()
            .input('input/image1.jpg')
            .input('input/image2.jpg')
            .input('input/image3.jpg')
            .input('input/image4.jpg')
            .input('input/image5.jpg')
            .complexFilter(complexFilter/*, 'out'*/)
            //.addOption('-filter_complex', complexFilter)
            .addOption('-map', '[v]',)
            .addOption('-c:v', 'libx264')
            .addOption('-t', '30')
            .output(outputFilePath)
            .on('start', (cmdline: string) => console.log(cmdline))
            .on('end', () => {
              console.log('Processing finished!');
            })
            .on('error', (err: Error) => {
              console.error('Error:', err);
            })
            .run();
    }

    /** 
     * Function to get length of each MP3 file.
     * If some element is null, the lenght of 0 will be placed in the resulting list of lengths
     */
    async getMp3Lengths(mp3FilePaths: (string | null)[]) {
        const lengths: number[] = [];

        for (const filePath of mp3FilePaths) {
            if(filePath === null){
                lengths.push(0);
                continue;
            }
            const metadata = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
                ffmpeg.ffprobe(filePath, (err:any, data:any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            const durationSeconds = metadata.format.duration as number;
            lengths.push(durationSeconds);
        }

        return lengths;
    }
}
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffprobePath.path);

export abstract class FfmpegHelper {
    public static async buildFfmpegCommand(
        inputImageFilesPaths: string[],
        inputAudioFilesPaths: (string | null)[],
        //inputFilePath: string,
        outputFilePath: string // this should be an mp4
    ) {
        if(inputImageFilesPaths.length !== inputAudioFilesPaths.length){
            throw new Error("Number of input image paths must be equal to number of input audio paths.");
        }

        const audioFileLengths = await FfmpegHelper.getMp3Lengths(inputAudioFilesPaths);

        const complexFilter: string[] = []
        let inputIndex = 0;

        for (const imageFilePath of inputImageFilesPaths) {
            let line = `[${inputIndex}:v]zoompan=z='min(zoom+0.0015,1.5)':d=25*${audioFileLengths[inputIndex]}:s=1280x720`; //d=25*5 would mean 25fps for 5 seconds
            if (inputIndex == 0) {
                line += ",fade=t=in:st=0:d=1";
            }
            line += ",fade=t=out:st=9:d=1";
            line += `[v${inputIndex}]`;

            complexFilter.push(line);

            inputIndex += 1;
        }

        let i = 0;
        for(const audioFilePath of inputAudioFilesPaths){
            const line = `[${inputIndex}:a]acopy[a${i}]`;
            //complexFilter.push(line);
            inputIndex += 1;
            i+=1;
        }

        let outputDefString = "";
        // concatenate into one output
        for (let i = 0; i < inputImageFilesPaths.length; i += 1) {
            outputDefString += `[v${i}]`; //since the number of video/image and audio inputs is the same, we can use the pairs of video/audio like this
            //outputDefString += `[v${i}][a${i}]`; //since the number of video/image and audio inputs is the same, we can use the pairs of video/audio like this
        }

        outputDefString += `concat=n=${inputImageFilesPaths.length}:v=1:a=1`;
        outputDefString += ',format=yuv420p[v]'; //"${outputFilePath}

        complexFilter.push(outputDefString);



        // -----------------------Execute ffmpeg command------------------------------
        const f = ffmpeg();

        for(const imageFilePath of inputImageFilesPaths){
            f.input(imageFilePath);
        }

        for (const audioFilePath of inputAudioFilesPaths) {
            //TODO: add anullsrc (silence) where the audio file path is null (no audio for that segment)
            // set some default lenght for the silence
            if (audioFilePath) {
                f.input(audioFilePath);
            }
        }

        
            f.complexFilter(complexFilter/*, 'out'*/)
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
            });
            
            f.run();
    }

    /** 
     * Function to get length of each MP3 file.
     * If some element is null, the lenght of 0 will be placed in the resulting list of lengths
     */
    private static async getMp3Lengths(mp3FilePaths: (string | null)[]) {
        const lengths: number[] = [];

        for (const filePath of mp3FilePaths) {
            if (filePath === null) {
                lengths.push(0);
                continue;
            }
            const metadata = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
                ffmpeg.ffprobe(filePath, (err: any, data: any) => {
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
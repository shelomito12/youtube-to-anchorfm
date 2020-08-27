const youtubedl = require('youtube-dl')
const fs = require('fs')
const { exec } = require('child_process');

const YT_URL = 'https://www.youtube.com/watch?v=';
const pathToEpisodeJSON = 'episode.json';
const outputFile = 'episode.webm'

try {
    const epConfJSON = JSON.parse(fs.readFileSync(pathToEpisodeJSON, 'utf-8'));
    
    const YT_ID = epConfJSON.id;
    
    const url = YT_URL + YT_ID;
    
    const video = youtubedl(url, ['--format=bestaudio'], { cwd: __dirname });
    
    youtubedl.getInfo(url, function(err, info) {
        if (err) throw err;
        epConfJSON.title = info.title;
        epConfJSON.description = info.description;
    });

    const youtubeDlCommand = `youtube-dl -o ${outputFile} -f bestaudio[ext=webm] ${url}`;

    exec(youtubeDlCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
        fs.writeFileSync(pathToEpisodeJSON, JSON.stringify(epConfJSON));
    });
    
    // video.on('info', function(info) {
    //     console.log('Download started')
    //     console.log('filename: ' + info._filename)
        
    //     // info.size will be the amount to download, add
    //     let total = info.size
    //     console.log('size: ' + total)
    // });
    
    // video.pipe(fs.createWriteStream(outputFile, { flags: 'a' }))
    
    // video.on('complete', function complete(info) {
    //     console.log('filename: ' + info._filename + ' already downloaded.')
    // });
    
    // video.on('end', function() {
    //     console.log('finished downloading!');
    //     fs.writeFileSync(pathToEpisodeJSON, JSON.stringify(epConfJSON));
    // })
} catch (error) {
    throw error;
}
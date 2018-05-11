# node-recorder

A simple cross-platform audio recoding utility for node

It requires the installation of the command line utility `rec`, which is part of `sox`

## Examples

__Record audio, trimming the beginning and the end to `audio.wav`__

```javascript
const mic = require('@scottishcyclops/node-recorder')
const audio = require('@scottishcyclops/node-audio')
const { createWriteStream } = require('fs')

async function main()
{
  const audiofile = __dirname + '/audio.wav'
  const out = createWriteStream(audiofile, { flags: 'w+', encoding: 'binary' })

  const recorder = mic.start({ trimEnd: true })

  recorder.stdout.pipe(out)

  out.once('close', async () => {
    mic.stop(recorder)
    await audio.play(audiofile)
  })
}

main().catch(console.error)
```

Please report any bugs [here](https://github.com/ScottishCyclops/node-recorder/issues)

# node-recorder

A simple cross-platform audio recoding utility for node

It requires the installation of the command line utility `rec`, which is part of `sox`

## Examples

__Record audio, trimming the beginning and the end to `audio.wav`__

```javascript
const mic = require("@scottishcyclops/node-recorder")
const { play } = require("@scottishcyclops/node-audio")
const { createWriteStream } = require("fs")

async function main()
{
    const audiofile = __dirname + "/audio.wav"
    const out = createWriteStream(audiofile, { flags: "w+", encoding: "binary" })

    mic.start({ trimEnd: true }).audio.pipe(out)

    out.once("close", () =>
    {
        play(audiofile)
    })
}


main().catch(console.error)
```

Please report any bugs [here](https://github.com/ScottishCyclops/node-recorder/issues)

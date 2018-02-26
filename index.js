const { spawn } = require("child_process")

// sox recording utility
const cmd = "rec"
const args = [
    "-q",  // quiet
    "-r", "16k",  // quality
    "-c", "1",  // mono
    "-e", "signed-integer",  // encoding
    "-b", "16",  // bit size
    "-t", "wav",  // format
    "-",  // pipe data to stdout (doesn't pipe if there is nothing, unlike '-p')
]

const defaults = {
    silence: 1.0,
    threshold: 0.5,
}

let recorder = null

module.exports = {
    /**
     * Start or restart the audio capture
     * @param {{endSilenceThreshold: number, endSilenceDuration: number, trimBeginning?: boolean, trimEnding?: boolean}} options spawn options.
     *
     * Set threshold to `0` to stop on silence
     *
     * Give `silence` value under 1 to cut quicker on silence
     */
    start: options =>
    {
        if(recorder !== null) recorder.kill()

        const opts = options || {}

        const endSilenceThreshold = (isNaN(opts.threshold) ? defaults.threshold : opts.endSilenceThreshold) + "%"
        const endSilenceDuration = (isNaN(opts.endSilenceDuration) ? defaults.silence : opts.endSilenceDuration).toFixed(1)

        const allArgs = args.concat([
            // silence effect of rec
            "silence",
            // should silence be trimmed at the beginning
            options.trimBeginning ? "1" : "0",
            // how much non-silence before starting in seconds
            "0.1",
            // threshold of silence
            endSilenceThreshold,
            // should silence be teimmed at the end
            options.trimEnding ? "1" : "0",
            // how much silence before stopping, in seconds
            endSilenceDuration, endSilenceThreshold
        ])

        recorder = spawn(cmd, allArgs)

        return {
            audio: recorder.stdout,
            info: recorder.stderr,
        }
    },
    /**
     * Stop the audio capture
     */
    stop: () =>
    {
        if(recorder === null) return

        recorder.stdout.unpipe()
        recorder.stderr.unpipe()
        recorder.kill()
        recorder = null
    }
}

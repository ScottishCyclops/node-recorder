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
    trimStart: {
        duration: 0.01,
        threshold: 15,
    },
    trimEnd: {
        duration: 1,
        threshold: 1.5
    }
}

let recorder = null

module.exports = {
    /**
     * Start or restart the audio capture
     * @param {{trimStart?: {threshold?: number, duration?: number} | boolean, trimEnd?: {threshold?: number, duration?: number}  | boolean}} options
     * trimStart: if true, beginning will be ignored until 0.01s of above 15% noise
     *
     * trimEnd: if true, mic will automatically stop after 1s of below 1.5% noise
     *
     * if trimming the end, the start will automatically be trimmed too with the default values
     *
     * to set other values for duration and threshold, pass an object insead of a boolean
     */
    start: options =>
    {
        if(recorder !== null) recorder.kill()

        options = options || {}

        const trimStart = options.trimStart ? true : false
        const trimEnd = options.trimEnd ? true : false

        options.trimStart = Object.assign({}, defaults.trimStart, options.trimStart)
        options.trimEnd = Object.assign({}, defaults.trimEnd, options.trimEnd)

        let allArgs = args

        if(trimStart || trimEnd) {
            allArgs = allArgs.concat([
                // silence effect of rec
                "silence",
                // should silence be trimmed at the beginning
                "1",
                // how much non-silence before starting in seconds
                options.trimStart.duration.toString(),
                // silence level in % (0% = pure silence)
                options.trimStart.threshold.toString() + "%",
            ])
        }

        if(trimEnd) {
            allArgs = allArgs.concat([
                // should silence be trimmed at the end
                "1",
                // how much silence before stopping, in seconds
                options.trimEnd.duration.toString(),
                // silence level
                options.trimEnd.threshold.toString() + "%",
            ])
        }

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

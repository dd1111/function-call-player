const
    fpsToDelay = fps => 1000 / fps,

    cond = function () {
        let last = arguments.length - 1,
            i = 0
        for (i; i < last; i += 2) {
            if (arguments[i]) {
                return arguments[i + 1]
            }
        }
        if (last % 2 === 0)
            return arguments[last]
    },


    defaults = (prop, defaults) => (prop !== undefined) ? prop : defaults // add validator later

    , setEvents = (nodes, events) => {
        if (nodes && events)
            Object.keys(events).forEach(key => {
                if (nodes[key]) {
                    nodes[key].addEventListener(events[key][0], events[key][1])
                }
            })
    }


const Player = (a = {}) => {

    const
        f = defaults(a.f, (iteration, direction) => console.log(`step ${iteration}    direction ${direction}`)),
        min = defaults(a.min, 0),
        max = defaults(a.max, Infinity),
        type = defaults(a.type, "stop"), // loop / backForth
        ui = a.ui
    let

        stepSize = defaults(a.stepSize, 1),
        i = defaults(a.i, min),
        delay = fpsToDelay(defaults(a.fps, 5)),
        loop = false,
        direction = 1

    const
        stop = () => {
            clearInterval(loop)
            loop = false
        },
//////////////////////////////////////////////////////////// making step
        _calculateI = () => i + direction * stepSize,


        _makeStep = newI => {
            i = newI
            if (ui && ui.playerI) ui.playerI.value = i
            f(i, direction)
        },


        _checkBorders = (i, min, max) => cond(
            i < min, "min",
            i > max, "max",
            false),


        _tryStep = {
            stop: (border, newI) => {
                if (border)
                    stop()
                else
                    _makeStep(newI)
            },
            loop: (border, newI) => _makeStep(cond(
                border === "max", min,
                border === "min", max,
                newI)),
        }[type],

        _prepareStep = newI => _tryStep(_checkBorders(newI, min, max), newI),

        _step = () => _prepareStep(_calculateI()),


///////////////////////////////////////////////////////////////
        _play = () =>
            loop = setInterval(_step, delay)
        ,

//////////////////////////////////////////////////////////////// interface
        play = (directionA = 1) => {
            if (loop) {
                if (directionA === direction)
                    stop()
            } else
                _play()
            direction = directionA
        },

        step = (directionA = 1) => {
            stop()
            direction = directionA
            _step()
        },

        setFps = (fps = 5) => {
            delay = fpsToDelay(fps)
            if (loop) {
                stop()
                _play()
            }
        },

        goToFrame = (frame = min) => {
            stop()
            _prepareStep(frame)
        },

        setStepSize = (stepSizeA = 1) => {
            stepSize = stepSizeA
        }

/////////////////////////////////////////////////////////////////////// ui


    setEvents(ui, {
        playerI: ["change", e => goToFrame(ui.playerI.value)],
        playerPlay: ["click", e => play()],
        playerPlayBack: ["click", e => play(-1)],
        playerStepNext: ["click", e => step(1)],
        playerStepBack: ["click", e => step(-1)]
    })


    return {
        play, stop,
        step, setFps,
        setStepSize,
        goToFrame,
    }
}

if (typeof module !== 'undefined')
    module.exports = Player
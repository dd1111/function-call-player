const
    p = Player({
        f:(iteration, direction) => console.log(`step ${iteration}    direction ${direction}`),
        stepSize:1,
        fps:1,
        i:0, // initial iteration
        min: 0,
        max: Infinity,
        type: "stop", // "loop"
        ui: {
            playerStepNext: document.getElementById("playerStepNext"),
            playerStepBack: document.getElementById("playerStepBack"),
            playerPlay: document.getElementById("playerPlay"),
            playerPlayBack: document.getElementById("playerPlayBack"),
            playerI: document.getElementById("playerI"),
        }
    })

// any property can be avoided. Defaults would be used instead
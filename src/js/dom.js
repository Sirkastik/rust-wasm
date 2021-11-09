// helper function
const $ = (id) => {
    return document.getElementById(id)
}

// initialize DOM
const elems = () => {
    return {
        message: $('message'),
        slider: $("sliderbox"),
        img: $('new-img'),
        output: $("value"),
        link: $('link'),
        loader: $('loading')
    }
}

const buttons = () => {
    return {
        icons: document.querySelectorAll('.icon'),
        compare: $('compare'),
        rotatecw: $('plus90'),
        rotateccw: $('min90'),
        delbtn: $('delete'),
        downbtn: $('download'),
        undo: $('undo')
    }
}

const inputs = () => {
    return {
        upload: $('upload'),
        main: $('main'),
        knob: $('thumb')
    }
}

export {
    elems, buttons, inputs
}
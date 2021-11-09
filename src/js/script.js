import '../css/style.css';
import process_img from './processImage';
import { elems, buttons, inputs } from './dom';
import './registerSW'

// Global variables
let base64, imgDataUrl;
let imgArr = [];
let min, max, value, effect;
let x, pos;
let loading = false;
const fileReader = new FileReader()
const loadEvent = new Event('loading');


// computed values
const processNow = () => {
    return effect == 'grayscale' || effect == 'invert' || effect == 'flip' || effect == 'crop'
}

const largeRange = () => {
    return effect == 'brightness' || effect == 'contrast'
}

const initial = (parentWidth) => {
    return ((value - min) / (max - min) * parentWidth) - 10;
}

// functions to be used
const resetColor = (children) => {
    for (let index = 0; index < children.length; index++) {
        children[index].style.color = "#101020"
    }
}

const setLoading = () => {
    const { loader } = elems()
    if (loading == false) {
        loader.style.opacity = 0
    } else {
        console.log(loading);
        loader.style.opacity = 1
    }
}

const show_slider = () => {
    const { slider } = elems()
    if (effect == 'blur') {
        show(.5, 9.5, 5)
    } else if (largeRange() == true) {
        show(-50, 50, 0)
    } else if (effect == 'sharpen') {
        show(-10, 10, 0)
    }
    else {
        slider.classList.add('hidden')
    }
}

const show = (minValue, maxValue, currentValue) => {
    const { slider, output } = elems()
    const { knob } = inputs()
    min = minValue;
    max = maxValue;
    value = currentValue;
    slider.classList.remove('hidden')
    const left = initial(knob.parentElement.clientWidth)
    knob.style.left = `${left}px`
    output.innerText = value
}

const mouseMoveHandler = (e) => {
    e.preventDefault()
    console.log("move...");
    const { knob } = inputs()
    const { output } = elems()
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const sliderWidth = knob.parentElement.clientWidth;
    const plimit = sliderWidth - pos
    const nlimit = pos - 0
    let newPos;
    if (dx <= plimit || dx >= -nlimit) {
        newPos = pos + dx;
        knob.style.left = `${newPos}px`
        value = ((newPos / sliderWidth) * (max - min)) + min
        if (effect != 'blur') {
            value = parseInt(value)
        } else {
            value = Math.round(value * 10) / 10
        }
        output.innerText = value
    }
};
// Triggered when user drops the knob
const mouseUpHandler = () => {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    // process image
    process();
};

const process = () => {
    loading = true
    window.dispatchEvent(loadEvent);
    const { icons } = buttons()
    resetColor(icons[0].parentElement.children)
    // setLoading(true)
    const { img } = elems()
    setTimeout(() => {
        imgDataUrl = process_img(effect, base64, value)
        img.src = imgDataUrl;
        base64 = imgDataUrl.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
        imgArr.push(imgDataUrl)
        loading = false
        window.dispatchEvent(loadEvent);
    }, 10);
}

// initialize events
(() => {
    const { icons, compare, rotatecw, rotateccw, delbtn, downbtn, undo } = buttons()
    const { message, slider, img, output, link, loader } = elems()
    const { upload, main, knob } = inputs()

    // Listen for the event.
    window.addEventListener('loading', setLoading, false);

    // Dispatch the event.
    window.dispatchEvent(loadEvent);

    // START OF BUTTONS EVENTS ...
    // left panel icons onclick
    icons.forEach((icon) => {
        icon.onclick = () => {
            if (!base64) {
                alert("Please upload image")
            } else {
                resetColor(icon.parentElement.children)
                icon.style.color = "#fff"
                const arr = icon.innerText.replace(/ /g, "").split("\n")
                const apply = arr[1].toLowerCase()
                effect = apply
                if (processNow() == true) {
                    process()
                }
                show_slider()
            }
        }
    })

    // compare image with original
    compare.onmousedown = (e) => {
        e.preventDefault()
        if (base64 && imgArr[0]) {
            img.src = imgArr[0]
        }
    }
    compare.ontouchstart = (e) => {
        e.preventDefault()
        if (base64 && imgArr[0]) {
            img.src = imgArr[0]
        }
    }
    compare.onmouseup = (e) => {
        e.preventDefault()
        if (base64 && imgDataUrl) {
            img.src = imgDataUrl
        }
    }
    compare.ontouchend = (e) => {
        e.preventDefault()
        if (base64 && imgDataUrl) {
            img.src = imgDataUrl
        }
    }

    // rotate effects
    rotatecw.onclick = () => {
        if (base64) {
            effect = 'rotate_90'
            process();
        } else {
            alert("Please upload an image");
        }
    }
    rotateccw.onclick = () => {
        if (base64) {
            effect = 'rotate_270'
            process();
        } else {
            alert("Please upload an image");
        }
    }

    loader.style.opacity = "0"

    // delete image
    delbtn.classList.add('hidden')
    delbtn.onclick = () => {
        resetColor(icons[0].parentElement.children)
        img.src = ""
        upload.value = ""
        delbtn.classList.add("hidden")
        message.classList.remove("hidden")
        slider.classList.add('hidden')
        base64 = null
    }

    // undo
    undo.onclick = () => {
        let size = imgArr.length;
        if (size > 1) {
            imgDataUrl = imgArr[size - 2]
            img.src = imgDataUrl
            base64 = imgArr[size - 2].replace(
                /^data:image\/(png|jpeg|jpg);base64,/, ''
            )
            imgArr.length = size - 1;
        }
    }

    // download image
    downbtn.onclick = () => {
        if (base64) {
            resetColor(icons[0].parentElement.children)
            link.download = `edited.png`;
            link.href = imgDataUrl;
            link.click()
            delbtn.classList.add('hidden')
            message.classList.remove("hidden")
            slider.classList.add('hidden')
            // downbtn.classList.add("gray")
            img.src = ''
            upload.value = ""
            base64 = null
        } else {
            alert("Please upload an image");
        }
    }
    // END OF BUTTON EVENTS

    // START OF INPUT EVENTS
    // handle file uploads
    upload.onchange = () => {
        fileReader.readAsDataURL(upload.files[0])
        img.src = window.URL.createObjectURL(upload.files[0])
        delbtn.classList.remove("hidden")
        delbtn.style.opacity = 0.4
        message.classList.add("hidden")
    }
    fileReader.onloadend = () => {
        imgArr.push(fileReader.result)
        base64 = fileReader.result.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
    }

    // main section drag and drop event
    main.ondrop = (e) => {
        e.preventDefault();
        main.classList.remove("drag")

        if (e.dataTransfer.items && e.dataTransfer.items[0].kind == 'file') {
            const file = e.dataTransfer.items[0].getAsFile();
            if (file.type == 'image/png') {
                imageInit = file
                fileReader.readAsDataURL(file)
                img.src = window.URL.createObjectURL(file)
                delbtn.classList.remove("hidden")
                message.classList.add("hidden")
            } else {
                alert("upload a png image")
            }
        }
    }
    main.ondragleave = (e) => {
        e.preventDefault();
        main.classList.remove("drag")
    }
    main.ondragover = (e) => {
        e.preventDefault();
        main.classList.add("drag")
    }

    // knob events for moving the slider
    knob.onmousedown = (e) => {
        // Get the current mouse position
        x = e.clientX;
        pos = knob.style.left
        pos = parseInt(pos.replace('px', ''))
        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    knob.ontouchstart = (e) => {
        e.preventDefault()
        // Get the current mouse position
        x = e.targetTouches[0].clientX;
        pos = knob.style.left
        pos = parseInt(pos.replace('px', ''))
    }
    knob.ontouchmove = (e) => {
        // How far the mouse has been moved
        const dx = e.targetTouches[0].clientX - x;
        const sliderWidth = knob.parentElement.clientWidth;
        const plimit = sliderWidth - pos
        const nlimit = pos - 0
        let newPos;
        if (dx <= plimit || dx >= -nlimit) {
            newPos = pos + dx;
            knob.style.left = `${newPos}px`
            value = ((newPos / sliderWidth) * (max - min)) + min
            if (effect != 'blur') {
                value = parseInt(value)
            } else {
                value = Math.round(value * 10) / 10
            }
            output.innerText = value
        }
    }
    knob.ontouchend = () => {
        process();
    }
    // End of input events
})();

window.onunload = () => {
    window.removeEventListener('loading', setLoading)
}
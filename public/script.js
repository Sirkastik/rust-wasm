import {
    grayscale, invert, flip_horizontal,
    rotate_90, rotate_180, rotate_270,
    blur, sharpen, brighten, crop, contrast
} from '../pkg';

import './style.css';

// Global variables
let base64, imgDataUrl, imageInit;
let min, max, value, effect;
let x, pos;
const fileReader = new FileReader()

// helper function
const $ = (id) => {
    return document.getElementById(id)
}

// function to get a random number
const getRnd = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

// function to process the image
const process_img = () => {
    let imgDataURL;
    switch (effect) {
        case 'grayscale':
            imgDataURL = grayscale(base64);
            break;
        case 'invert':
            imgDataURL = invert(base64);
            break;
        case 'flip':
            imgDataURL = flip_horizontal(base64);
            break;
        case 'rotate_90':
            imgDataURL = rotate_90(base64);
            break;
        case 'rotate_180':
            imgDataURL = rotate_180(base64);
            break;
        case 'rotate_270':
            imgDataURL = rotate_270(base64);
            break;
        case 'blur':
            imgDataURL = blur(base64, parseFloat(value));
            break;
        case 'sharpen':
            imgDataURL = sharpen(base64, parseFloat(value), getRnd(60, 100));
            break;
        case 'brightness':
            imgDataURL = brighten(base64, parseInt(value));
            break;
        case 'crop':
            imgDataURL = crop(base64, 0, 0, 320, 180);
            break;
        case 'contrast':
            imgDataURL = contrast(base64, parseFloat(value));
            break;
        default:
            imgDataURL = grayscale(base64);
    }
    return imgDataURL
}

// initialize DOM
const elems = () => {
    return {
        message: $('message'),
        slider: $("sliderbox"),
        img: $('new-img'),
        output: $("value"),
        link: $('link'),
    }
}

const buttons = () => {
    return {
        icons: document.querySelectorAll('.icon'),
        compare: $('compare'),
        rotatecw: $('plus90'),
        rotateccw: $('min90'),
        delbtn: $('delete'),
        downbtn: $('download')
    }
}

const inputs = () => {
    return {
        upload: $('upload'),
        main: $('main'),
        knob: $('thumb')
    }
}

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
        children[index].style.color = "#8e8eab"
    }
}

const showSlider = () => {
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
    const { img } = elems()
    imgDataUrl = process_img()
    img.src = imgDataUrl;
    base64 = imgDataUrl.replace(
        /^data:image\/(png|jpeg|jpg);base64,/, ''
    )
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

// initialize events
(() => {
    const { icons, compare, rotatecw, rotateccw, delbtn, downbtn } = buttons()
    const { message, slider, img, link } = elems()
    const { upload, main, knob } = inputs()

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
                    imgDataUrl = process_img()
                    img.src = imgDataUrl;
                    base64 = imgDataUrl.replace(
                        /^data:image\/(png|jpeg|jpg);base64,/, ''
                    )
                }
                showSlider()
            }
        }
    })

    // compare image with original
    compare.onmousedown = () => {
        if (base64 && imageInit) {
            img.src = imageInit
        }
    }
    compare.onmouseup = () => {
        if (base64 && imgDataUrl) {
            img.src = imgDataUrl
        }
    }

    // rotate effects
    rotatecw.onclick = () => {
        if (base64) {
            effect = 'rotate_90'
            imgDataUrl = process_img()
            img.src = imgDataUrl;
            base64 = imgDataUrl.replace(
                /^data:image\/(png|jpeg|jpg);base64,/, ''
            )
        } else {
            alert("Please upload an image");
        }
    }
    rotateccw.onclick = () => {
        if (base64) {
            effect = 'rotate_270'
            imgDataUrl = process_img()
            img.src = imgDataUrl;
            base64 = imgDataUrl.replace(
                /^data:image\/(png|jpeg|jpg);base64,/, ''
            )
        } else {
            alert("Please upload an image");
        }
    }

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

    // download image
    downbtn.onclick = () => {
        if (base64) {
            resetColor(icons[0].parentElement.children)
            link.download = `edited.png`;
            link.href = imgDataUrl;
            link.click()
            $('delete').classList.add('hidden')
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
        message.classList.add("hidden")
    }
    fileReader.onloadend = () => {
        imageInit = fileReader.result
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
        pos = thumb.style.left
        pos = parseInt(pos.replace('px', ''))
        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    // End of input events
})();




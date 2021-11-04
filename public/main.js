const { rotate_90 } = require('../pkg')

require('./style.css')

const $ = (id) => {
    return document.getElementById(id)
}

const setup = async () => {
    let rustApp = null
    try {
        rustApp = await import('../pkg')
        console.log(rustApp);
    } catch (e) {
        console.error(e);
        return;
    }

    const { upload, icons, message, sliderbox, image, link, downbtn, output, fileReader, thumb } = init();

    let x, y;

    let min, max, value;

    let pos;

    let imgDataUrl;

    let imageInit;
    let base64;

    let effect;

    let children;

    // let effects;
    icons.forEach((icon) => {
        icon.onclick = () => {
            if (!base64) {
                alert("Please upload image")
            } else {
                children = icon.parentElement.children
                resetColor()
                icon.style.color = "#fff"
                const arr = icon.innerText.replace(/ /g, "").split("\n")
                const apply = arr[1].toLowerCase()
                effect = apply
                if (oneClick(effect)) {
                    imgDataUrl = process_img(rustApp, base64, effect, value)
                    image.src = imgDataUrl;
                    base64 = imgDataUrl.replace(
                        /^data:image\/(png|jpeg|jpg);base64,/, ''
                    )
                }
                showSlider()
            }
        }
    })

    const resetColor = () => {
        for (let index = 0; index < children.length; index++) {
            children[index].style.color = "#8e8eab"
        }
    }


    upload.onchange = () => {
        fileReader.readAsDataURL(upload.files[0])
        image.src = window.URL.createObjectURL(upload.files[0])
        $('delete').classList.remove("hidden")
        message.classList.add("hidden")
    }

    fileReader.onloadend = () => {
        imageInit = fileReader.result
        base64 = fileReader.result.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
    }

    // download image
    downbtn.onclick = () => {
        link.download = `img-${effect}.png`;
        link.href = imgDataUrl;
        link.click()
        $('delete').classList.add('hidden')
        message.classList.remove("hidden")
        sliderbox.classList.add('hidden')
        // downbtn.classList.add("gray")
        image.src = ''
    }

    $('plus90').onclick = () => {
        effect = 'rotate_90'
        imgDataUrl = process_img(rustApp, base64, effect, value)
        image.src = imgDataUrl;
        base64 = imgDataUrl.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
    }

    $('min90').onclick = () => {
        effect = 'rotate_270'
        imgDataUrl = process_img(rustApp, base64, effect, value)
        image.src = imgDataUrl;
        base64 = imgDataUrl.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
    }

    $('thumb').onmousedown = (e) => {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;

        pos = thumb.style.left
        pos = pos.replace('px', '')
        pos = parseInt(pos)

        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = (e) => {
        e.preventDefault()
        // How far the mouse has been moved
        const dx = e.clientX - x;
        const dy = e.clientY - y;
        const sliderWidth = thumb.parentElement.clientWidth;
        const plimit = sliderWidth - pos
        const nlimit = pos - 0
        let newPos;
        if (dx > plimit || dx < -nlimit) {
            return
        } else {
            newPos = pos + dx;
            thumb.style.left = `${newPos}px`
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
        imgDataUrl = process_img(rustApp, base64, effect, value)
        image.src = imgDataUrl;
        base64 = imgDataUrl.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    $('compare').onmousedown = () => {
        image.src = imageInit
    }
    $('compare').onmouseup = () => {
        image.src = imgDataUrl
    }

    $('main').ondrop = (e) => {
        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();
        $("main").classList.remove("drag")

        if (e.dataTransfer.items && e.dataTransfer.items[0].kind == 'file') {
            const file = e.dataTransfer.items[0].getAsFile();
            if (file.type == 'image/png') {
                imageInit = file
                fileReader.readAsDataURL(file)
                image.src = window.URL.createObjectURL(file)
                $('delete').classList.remove("hidden")
                message.classList.add("hidden")
            } else {
                alert("upload a png image")
            }
        }
    }

    $('main').ondragleave = (e) => {
        e.preventDefault();
        $("main").classList.remove("drag")
    }

    $('main').ondragover = (e) => {
        e.preventDefault();
        $("main").classList.add("drag")
    }

    const showSlider = () => {
        if (effect == 'blur') {
            show(.5, 9.5, 5)
        } else if (large()) {
            show(-50, 50, 0)
        } else if (effect == 'sharpen') {
            show(-5, 5, 0)
        }
        else {
            sliderbox.classList.add('hidden')
        }
    }

    const show = (minValue, maxValue, currentValue) => {
        min = minValue;
        max = maxValue;
        value = currentValue;
        sliderbox.classList.remove('hidden')
        const initial = ((value - min) / (max - min) * thumb.parentElement.clientWidth) - 10;
        thumb.style.left = `${initial}px`
        output.innerText = value
    }

    const large = () => {
        return effect == 'brightness' || effect == 'contrast'
    }

    $('delete').classList.add('hidden')

    $('delete').onclick = () => {
        image.src = ""
        $('upload').value = ""
        $('delete').classList.add("hidden")
        message.classList.remove("hidden")
        sliderbox.classList.add('hidden')
    }

}

const init = () => {
    return {
        upload: $('upload'),
        icons: document.querySelectorAll('.icon'),
        message: $('message'),
        slider: $("slider"),
        sliderbox: $("sliderbox"),
        image: $('new-img'),
        link: $('link'),
        downbtn: $('download'),
        output: $("value"),
        fileReader: new FileReader(),
        thumb: $('thumb')
    }
}

const oneClick = (effect) => {
    return effect == 'grayscale' || effect == 'invert' || effect == 'flip' || effect == 'crop'
}

const process_img = (rustApp, base64, effect, value) => {
    let imgDataURL;
    switch (effect) {
        case 'grayscale':
            imgDataURL = rustApp.grayscale(base64);
            break;
        case 'invert':
            imgDataURL = rustApp.invert(base64);
            break;
        case 'flip':
            imgDataURL = rustApp.flip_horizontal(base64);
            break;
        case 'rotate_90':
            imgDataURL = rustApp.rotate_90(base64);
            break;
        case 'rotate_180':
            imgDataURL = rustApp.rotate_180(base64);
            break;
        case 'rotate_270':
            imgDataURL = rustApp.rotate_270(base64);
            break;
        case 'blur':
            imgDataURL = rustApp.blur(base64, parseFloat(value));
            break;
        case 'sharpen':
            imgDataURL = rustApp.sharpen(base64, parseFloat(value), getRnd(90, 120));
            break;
        case 'brightness':
            imgDataURL = rustApp.brighten(base64, parseInt(value));
            break;
        case 'crop':
            imgDataURL = rustApp.crop(base64, 0, 0, 320, 180);
            break;
        case 'contrast':
            imgDataURL = rustApp.contrast(base64, parseFloat(value));
            break;
        default:
            imgDataURL = rustApp.grayscale(base64);
    }
    return imgDataURL
}

function getRnd(min, max) {
    const rand = Math.floor(Math.random() * (max - min)) + min;
    console.log(rand);
    return rand
}


setup();
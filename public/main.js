const init = async () => {
    let rustApp = null
    try {
        rustApp = await import('../pkg')
    } catch (e) {
        console.error(e);
        return;
    }

    const file_input = document.getElementById('upload')
    const effect = document.getElementById('effect')
    const submit_btn = document.getElementById('submit')
    const slider = document.getElementById("myRange");
    const sliderbox = document.getElementById("slider");
    const fileReader = new FileReader()
    const image = document.getElementById('new-img')

    let effect_value = document.getElementById("value");
    effect_value.innerHTML = slider.value;


    const down_btn = document.getElementById('download')
    const link = document.getElementById('link')

    let base64;

    file_input.onchange = () => {
        fileReader.readAsDataURL(file_input.files[0])
        document.getElementById('new-img')
            .setAttribute('src', window.URL.createObjectURL(file_input.files[0]))
        down_btn.classList.add("hidden")
    }

    fileReader.onloadend = () => {
        base64 = fileReader.result.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
    }

    effect.onchange = () => {
        if (effect.value == 'blur') {
            sliderbox.classList.remove('hidden')
            slider.max = 3
            slider.step = .1
            slider.value = 1.5
            effect_value.innerHTML = slider.value;
        } else if (effect.value == 'brighten') {
            sliderbox.classList.remove('hidden')
            slider.max = 50
            slider.step = 1
            slider.value = 25
            effect_value.innerHTML = slider.value;
        } else {
            sliderbox.classList.add('hidden')
        }
    }

    slider.oninput = () => {
        effect_value.innerHTML = slider.value;
    }

    down_btn.onclick = () => {
        link.download = `img-${effect.value}.png`;
        link.click()
        down_btn.removeChild(link);
        down_btn.classList.add("hidden")
        image.src = ''
        delete link;
    }

    submit_btn.onclick = () => {
        if (base64) {
            let img_data_url = process_img(rustApp, base64, effect.value, slider.value);
            image.src = img_data_url
            down_btn.classList.remove("hidden")
            link.href = img_data_url;
        } else {
            alert('Please upload image')
        }
    }
}

const process_img = (rustApp, base64, effect, value) => {
    let img_data_url;
    switch (effect) {
        case 'grayscale':
            img_data_url = rustApp.grayscale(base64);
            break;
        case 'rotate_90':
            img_data_url = rustApp.rotate_90(base64);
            break;
        case 'rotate_180':
            img_data_url = rustApp.rotate_180(base64);
            break;
        case 'rotate_270':
            img_data_url = rustApp.rotate_270(base64);
            break;
        case 'blur':
            img_data_url = rustApp.blur(base64, parseFloat(value));
            break;
        case 'brighten':
            img_data_url = rustApp.brighten(base64, parseInt(value));
            break;
        case 'crop':
            img_data_url = rustApp.crop(base64, 0, 0, 320, 180);
            break;
        default:
            img_data_url = rustApp.grayscale(base64);
    }
    return img_data_url
}

init();
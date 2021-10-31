const init = async () => {
    let rustApp = null

    try {
        rustApp = await import('../pkg')
    } catch (e) {
        console.error(e);
        return;
    }

    console.log(rustApp);

    const input = document.getElementById('upload')
    let effect = document.getElementById('effect')
    const fileReader = new FileReader()
    let operation;

    fileReader.onloadend = () => {
        let base64 = fileReader.result.replace(
            /^data:image\/(png|jpeg|jpg);base64,/, ''
        )
        let img_data_url;

        if (operation == 'grayscale') {
            img_data_url = rustApp.grayscale(base64);
        } else if (operation == 'brighten') {
            img_data_url = rustApp.brighten(base64, 10);
        } else {
            console.log(operation)
        }
        document.getElementById('new-img')
            .setAttribute('src', img_data_url)
    }

    input.addEventListener('change', () => {
        fileReader.readAsDataURL(input.files[0])
    })
    effect.addEventListener('change', () => {
        operation = effect.value;
    })
}

init();
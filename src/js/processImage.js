// function to get a random number
const getRnd = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

// function to process the image
const process_img = async (effect, base64, value) => {
    const {
        grayscale, invert, flip_horizontal,
        rotate_90, rotate_180, rotate_270,
        blur, sharpen, brighten, crop, contrast
    } = await import('../../pkg')
    
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
            imgDataURL = sharpen(base64, parseFloat(value), getRnd(80, 100));
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

export default process_img;
use base64::{decode, encode};
use image::load_from_memory;
use image::ImageOutputFormat::Png;
use wasm_bindgen::prelude::*;
use web_sys::console::log_1 as log;

#[wasm_bindgen]
pub fn grayscale(encoded_file: &str) -> String {
    log(&"Grayscale called...".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"...Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"...Image loaded".into());

    img = img.grayscale();
    log(&"...Grayscale effect applied".into());

    let mut buffer = vec![];
    img.write_to(&mut buffer, Png).unwrap();
    log(&"...New image written".into());

    let encoded_img = encode(&buffer);
    let data_url = format!("data:image/png;base64,{}", encoded_img);

    data_url
}

#[wasm_bindgen]
pub fn brighten(encoded_file: &str, brighten_value: i32) -> String {
    log(&"Brighten called...".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"...Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"...Image loaded".into());

    img = img.brighten(brighten_value);
    log(&"...Brighten effect applied".into());

    let mut buffer = vec![];
    img.write_to(&mut buffer, Png).unwrap();
    log(&"...New image written".into());

    let encoded_img = encode(&buffer);
    let data_url = format!("data:image/png;base64,{}", encoded_img);

    data_url
}

#[wasm_bindgen]
pub fn blur(encoded_file: &str, blur_sigma: f32) -> String {
    log(&"Blur called...".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"...Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"...Image loaded".into());

    img = img.blur(blur_sigma);
    log(&"...Blur effect applied".into());

    let mut buffer = vec![];
    img.write_to(&mut buffer, Png).unwrap();
    log(&"...New image written".into());

    let encoded_img = encode(&buffer);
    let data_url = format!("data:image/png;base64,{}", encoded_img);

    data_url
}

#[wasm_bindgen]
pub fn rotate_90(encoded_file: &str) -> String {
    log(&"Rotate90 called...".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"...Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"...Image loaded".into());

    img = img.rotate90();
    log(&"...Rotate90 effect applied".into());

    let mut buffer = vec![];
    img.write_to(&mut buffer, Png).unwrap();
    log(&"...New image written".into());

    let encoded_img = encode(&buffer);
    let data_url = format!("data:image/png;base64,{}", encoded_img);

    data_url
}

#[wasm_bindgen]
pub fn rotate_180(encoded_file: &str) -> String {
    log(&"Rotate180 called...".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"...Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"...Image loaded".into());

    img = img.rotate180();
    log(&"...Rotate180 effect applied".into());

    let mut buffer = vec![];
    img.write_to(&mut buffer, Png).unwrap();
    log(&"...New image written".into());

    let encoded_img = encode(&buffer);
    let data_url = format!("data:image/png;base64,{}", encoded_img);

    data_url
}

#[wasm_bindgen]
pub fn rotate_270(encoded_file: &str) -> String {
    log(&"Rotate270 called...".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"...Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"...Image loaded".into());

    img = img.rotate270();
    log(&"...Rotate270 effect applied".into());

    let mut buffer = vec![];
    img.write_to(&mut buffer, Png).unwrap();
    log(&"...New image written".into());

    let encoded_img = encode(&buffer);
    let data_url = format!("data:image/png;base64,{}", encoded_img);

    data_url
}

#[wasm_bindgen]
pub fn crop(encoded_file: &str, x: u32, y: u32, width: u32, height: u32) -> String {
    log(&"Crop called...".into());

    let base64_to_vector = decode(encoded_file).unwrap();
    log(&"...Image decoded".into());

    let mut img = load_from_memory(&base64_to_vector).unwrap();
    log(&"...Image loaded".into());

    img = img.crop(x, y, width, height);
    log(&"...Crop effect applied".into());

    let mut buffer = vec![];
    img.write_to(&mut buffer, Png).unwrap();
    log(&"...New image written".into());

    let encoded_img = encode(&buffer);
    let data_url = format!("data:image/png;base64,{}", encoded_img);

    data_url
}

import os
import cairosvg
from werkzeug.datastructures import FileStorage
from typing import Union
from pathlib import Path
from werkzeug.utils import secure_filename
from PIL import Image

from utils.global_vars import IMAGE_EXT, MAX_IMAGE_HEIGHT

IMAGES = tuple("jpg jpe jpeg png gif svg bmp webp".split())


def sanitize_filename(filename: str) -> str:
    return secure_filename(filename).lower()


def extension_is_valid(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in IMAGES


def save_img(image: FileStorage, folder: str, base_filename: str) -> str:
    """Takes Filestorage and saves it to a folder"""
    base_filename = sanitize_filename(base_filename).lower()
    filename = "{}.{}".format(base_filename, IMAGE_EXT)
    Path(folder).mkdir(exist_ok=True, parents=True)
    fq_filename = os.path.join(folder, filename)
    fq_png_filename = None

    if get_extension(image) == "svg":
        png_filename = "{}.png".format(base_filename)
        fq_png_filename = os.path.join(folder, png_filename)
        cairosvg.svg2png(file_obj=image, write_to=fq_png_filename)
        image = fq_png_filename

    with Image.open(image) as pil_image:
        width, height = pil_image.size
        if height > MAX_IMAGE_HEIGHT:
            new_width = int((MAX_IMAGE_HEIGHT / height) * width)
            pil_image = pil_image.resize((new_width, MAX_IMAGE_HEIGHT))

        pil_image.save(fq_filename)

    if fq_png_filename:
        os.remove(fq_png_filename)

    return fq_filename


def find_img_any_format(filename: str, folder: str) -> Union[str, None]:
    """Takes a basename and returns and image on any of the accepted formats"""
    for file_extension in IMAGES:
        image = "{}.{}".format(filename.lower, file_extension)
        image_path = os.path.join(folder, image)
        if os.path.isfile(image_path):
            return image_path
    return None


def get_img_filename(file: Union[str, FileStorage]) -> str:
    """Take Filestorage of basename and return the file basename"""
    if isinstance(file, FileStorage):
        return file.filename
    return file


def get_basename(file: Union[str, FileStorage]) -> str:
    """return full basename of image in the path"""
    filename = get_img_filename(file)
    return os.path.split(filename)[0]


def get_extension(file: Union[str, FileStorage]) -> str or bool:
    """Return file extension"""
    filename = get_img_filename(file)
    if extension_is_valid(filename):
        return os.path.splitext(filename)[1].split(".")[1]
    return False


def get_fq_filename(country_id, folder):
    filename = "{}.{}".format(country_id, IMAGE_EXT)
    sanitized_filename = sanitize_filename(filename).lower()
    fq_filename = os.path.join(folder, sanitized_filename)
    return fq_filename

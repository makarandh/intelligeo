import os

from werkzeug.datastructures import FileStorage
from typing import Union
from pathlib import Path
from werkzeug.utils import secure_filename

IMAGES = tuple("jpg jpe jpeg png gif svg bmp webp".split())


def sanitize_filename(filename: str) -> str:
    return secure_filename(filename).lower()


def extension_is_valid(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in IMAGES



def save_img(image: FileStorage, folder: str = None, filename: str = None) -> Union[str, bool]:
    """Takes Filestorage and saves it to a folder"""
    if filename:
        filename = sanitize_filename(filename)
    else:
        filename = sanitize_filename(image.filename)
    filename = filename.lower()
    if extension_is_valid(filename):
        Path(folder).mkdir(exist_ok=True, parents=True)
        image.save(os.path.join(folder, filename))
        return filename
    return False


def find_img_any_format(filename: str, folder: str) -> Union[str, None]:
    """Takes a filename and returns and image on any of the accepted formats"""
    for file_extension in IMAGES:
        image = "{}.{}".format(filename.lower, file_extension)
        image_path = os.path.join(folder, image)
        if os.path.isfile(image_path):
            return image_path
    return None


def get_img_filename(file: Union[str, FileStorage]) -> str:
    """Take Filestorage of filename and return the file filename"""
    if isinstance(file, FileStorage):
        return file.filename
    return file


def get_basename(file: Union[str, FileStorage]) -> str:
    """return full filename of image in the path"""
    filename = get_img_filename(file)
    return os.path.split(filename)[1]


def get_extension(file: Union[str, FileStorage]) -> str or bool:
    """Return file extension"""
    filename = get_img_filename(file)
    if extension_is_valid(filename):
        return os.path.splitext(filename)[1]
    return False


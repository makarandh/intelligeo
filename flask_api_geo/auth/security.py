import base64
import binascii
import hashlib
import os
import bcrypt


def hash_password(password):
    return hash_password_bcrypt(password)


def verify_password(hashed_password, plaintext_password):
    return verify_password_bcrypt(hashed_password, plaintext_password)


def hash_password_hashlib(password):
    """Hash a plaintext_password for storing."""
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha512', str(password).encode('utf-8'),
                                  salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')


def verify_password_hashlib(hashed_password, plaintext_password):
    """Verify a stored plaintext_password against one provided by user"""
    salt = hashed_password[:64]
    hashed_password = hashed_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha512',
                                  str(plaintext_password).encode('utf-8'),
                                  salt.encode('ascii'),
                                  100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == hashed_password


def hash_password_bcrypt(password):
    """Hash a plaintext_password for storing.
    The bcrypt algorithm only handles passwords up to 72 characters.
    So we hash a password with sha256 and then base64 encode it.
    Ref: https://github.com/pyca/bcrypt/ """
    salt = bcrypt.gensalt()
    pwd_sha256 = hashlib.sha256(str(password).encode("utf-8")).digest()
    pwd_base64 = base64.b64encode(pwd_sha256)
    return bcrypt.hashpw(pwd_base64, salt)


def verify_password_bcrypt(hashed_password, plaintext_password):
    """Verify a stored plaintext_password against one provided by user"""
    pwd_sha256 = hashlib.sha256(str(plaintext_password).encode("utf-8")).digest()
    pwd_base64 = base64.b64encode(pwd_sha256)
    return bcrypt.checkpw(pwd_base64, hashed_password)


from marshmallow import Schema, fields


class UserSchema(Schema):
    username = fields.String(required=True)
    password = fields.String(required=True)
    admin = fields.Bool(required=False)

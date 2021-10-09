from marshmallow import Schema, fields


class EmailSchema(Schema):
    name = fields.String(required=True)
    email = fields.String(required=True)
    message = fields.String(required=True)

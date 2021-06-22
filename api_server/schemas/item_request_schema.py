from marshmallow import Schema, fields


class ItemRequestSchema(Schema):
    page_num = fields.Integer(required=True)
    items_per_page = fields.Integer(required=False)


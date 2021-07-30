from marshmallow import fields, Schema, validates_schema, ValidationError

from utils.global_vars import COUNT


class RandomCountriesRequestSchema(Schema):
    count = fields.Integer(required=True)
    exclude = fields.Integer(required=False)

    @validates_schema
    def count_is_positive(self, data, **kwargs):
        if data[COUNT] <= 0:
            raise ValidationError("'count' needs to be an integer greater than 0")

from marshmallow import Schema, fields, validate


class QuestionAnsSchema(Schema):
    question = fields.String(required=True)
    ans = fields.Bool(required=True)


class MetaSchema(Schema):
    continent = fields.String(required=False)
    region = fields.String(required=False)

class ImageInfoSchema(Schema):
    photographer = fields.String(required=True)
    url = fields.String(required=True)


class CountrySchema(Schema):
    id = fields.Integer(required=False)
    name = fields.String(required=True, validate=validate.Length(min=1))
    clues = fields.List(fields.String(required=True))
    question_ans = fields.List(fields.Nested(QuestionAnsSchema, required=True))
    meta = fields.Nested(MetaSchema, required=True)
    image_info = fields.Nested(ImageInfoSchema, required=False)


class CountryRequestSchema(Schema):
    id = fields.Integer(required=True)

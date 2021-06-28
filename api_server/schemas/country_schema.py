from marshmallow import Schema, fields


class QuestionAnsSchema(Schema):
    question = fields.String(required=True)
    ans = fields.Bool(required=True)


class MetaSchema(Schema):
    continent = fields.String(required=True)
    region = fields.String(required=True)


class CountrySchema(Schema):
    name = fields.String(required=True)
    clues = fields.List(fields.String(required=True))
    question_ans = fields.List(fields.Nested(QuestionAnsSchema, required=True))
    meta = fields.Nested(MetaSchema, required=True)


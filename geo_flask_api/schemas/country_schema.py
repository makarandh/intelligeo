import typing
from marshmallow import Schema, fields, validate, ValidationError


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


class Page(fields.Field):

    def _serialize(self, value: typing.Any, attr: str, obj: typing.Any, **kwargs):
        try:
            value = int(value)
            return value
        except Exception as e:
            raise ValidationError("Page needs to be a positive integer.") from e

    def _deserialize(
        self,
        value: typing.Any,
        attr: typing.Optional[str],
        data: typing.Optional[typing.Mapping[str, typing.Any]],
        **kwargs
    ):
        try:
            value = int(value)
            if value < 1:
                raise Exception("Page is out of range.")
            return value
        except Exception as e:
            raise ValidationError("Page needs to be a positive integer.") from e


class CountriesSchema(Schema):
    page_num = Page(required=True)
    items_per_page = Page(required=True)


class PublishSchema(Schema):
    id = fields.Integer(required=True)
    publish = fields.Bool(required=True)

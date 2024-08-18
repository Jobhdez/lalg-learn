from django import forms


class VectorExpressionForm(forms.Form):
    exp = forms.CharField()

class MatrixExpressionForm(forms.Form):
    exp = forms.CharField()
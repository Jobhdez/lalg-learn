from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from src.compilers.parser import parser
from src.compilers.interpreter import evaluate
from src.server.api.forms import VectorExpressionForm, MatrixExpressionForm

@api_view(['POST'])
@csrf_exempt
def evaluate_vector_expression(request):
    def format_vector(lst):
        return '[' + ' '.join(map(str, lst)) + ']'

    form = VectorExpressionForm(request.POST)
    if form.is_valid():
        #form.save(commit=False)
        vector_exp = form.cleaned_data['exp']
        ast = parser.parse(vector_exp)
        expr = format_vector(evaluate(ast))
       # expr_model = VectorExpression(exp=expr)
        #expr_model.save()
        return Response({'exp': expr})


@api_view(['POST'])
@csrf_exempt
def evaluate_matrix_expression(request):
    def format_matrix(matrix):
        return '[{}]'.format(' '.join(['[' + ' '.join(map(str, row)) + ']' for row in matrix]))


    form = MatrixExpressionForm(request.POST)
    if form.is_valid():
        #form.save(commit=False)
        mat_exp = form.cleaned_data['exp']
        ast = parser.parse(mat_exp)
        expr = format_matrix(evaluate(ast))
       # expr_model = VectorExpression(exp=expr)
        #expr_model.save()
        return Response({'exp': expr})

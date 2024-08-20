from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from src.compilers.parser import parser
from src.compilers.interpreter import evaluate
from src.server.api.forms import VectorExpressionForm, MatrixExpressionForm
from src.compilers.ast_to_lalg import ast_to_lalg
from src.compilers.lalg_to_c import lalg_to_c

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

@api_view(['POST'])
@csrf_exempt
def compile_matrix_expression(request):
    form = MatrixExpressionForm(request.POST)
    if form.is_valid():
        mat_exp = form.cleaned_data['exp']
        ast = parser.parse(mat_exp)
        ir = ast_to_lalg(ast)
        c = lalg_to_c(ir)
        return Response({'exp': c})

@api_view(['POST'])
@csrf_exempt
def compile_vector_expression(request):
    form = VectorExpressionForm(request.POST)
    if form.is_valid():
        vec_exp = form.cleaned_data['exp']
        ast = parser.parse(vec_exp)
        ir = ast_to_lalg(ast)
        c = lalg_to_c(ir)
        return Response({'exp': c})
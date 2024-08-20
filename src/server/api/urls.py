from django.urls import path
from api import views

app_name="api"

urlpatterns=[
    path("vector/", views.evaluate_vector_expression, name="vector"),
    path("matrix/", views.evaluate_matrix_expression, name="matrix"),
    path("c/matrix/", views.compile_matrix_expression, name="cmatrix"),
    path("c/vector/", views.compile_vector_expression, name="cvector"),
    ]

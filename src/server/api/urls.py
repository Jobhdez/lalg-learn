from django.urls import path
from api import views

app_name="api"

urlpatterns=[
    path("vector/", views.evaluate_vector_expression, name="vector"),
    path("matrix/", views.evaluate_matrix_expression, name="matrix"),
    ]

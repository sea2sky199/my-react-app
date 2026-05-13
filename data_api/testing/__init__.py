import pytest
from data_api.app import create_app


@pytest.fixture
def client():
    app = create_app()
    client = app.test_client()
    return client

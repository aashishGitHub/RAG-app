# Simple Python test file for Copilot instruction verification
def bad_function(x):
    # Missing type hints, poor error handling
    return x / 0  # Division by zero

class BadClass:
    # Missing docstring, poor naming
    def __init__(self, data):
        self.d = data  # Poor variable naming
    
    def process(self):
        # No error handling, missing return type
        pass
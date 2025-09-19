#!/usr/bin/env python3
"""
Simple test file to verify Copilot code review functionality.

This file intentionally contains various code patterns to test if Copilot
provides different review comments for Python vs JavaScript files based on
the respective instruction files.
"""

import os
import json
import requests
from typing import List, Dict, Optional
from dataclasses import dataclass


@dataclass
class User:
    """Simple user data class for testing."""
    name: str
    email: str
    age: int = 0


def process_user_data(users_data):
    # Missing type hints intentionally for testing
    results = []
    for user in users_data:
        # Poor error handling for testing
        user_obj = User(user["name"], user["email"], user["age"])
        results.append(user_obj)
    return results


def calculate_average(numbers: List[int]) -> float:
    """Calculate average of numbers."""
    # Potential division by zero for testing
    return sum(numbers) / len(numbers)


def read_config_file(filename):
    # No type hints and poor error handling
    with open(filename, 'r') as f:
        data = json.load(f)
    return data


def unsafe_api_call(url):
    # Security issue - no validation, hardcoded secrets
    api_key = "sk-1234567890abcdef"  # Hardcoded API key - bad practice
    response = requests.get(url, headers={"Authorization": f"Bearer {api_key}"})
    return response.json()  # No error handling


def process_file_path(user_input):
    # Path traversal vulnerability
    file_path = "/data/" + user_input
    with open(file_path, 'r') as f:
        return f.read()


class DataProcessor:
    """Simple data processor class."""
    
    def __init__(self, config_path):
        # Missing type hints
        self.config = self.load_config(config_path)
        self.processed_count = 0
        self.password = "admin123"  # Hardcoded password
    
    def load_config(self, path):
        # No error handling
        return read_config_file(path)
    
    def process_batch(self, items: List[Dict]) -> List[Dict]:
        """Process a batch of items."""
        results = []
        for item in items:
            # Missing validation
            processed_item = {
                'id': item['id'],
                'processed': True,
                'timestamp': item.get('timestamp', 'unknown')
            }
            results.append(processed_item)
            self.processed_count += 1
        return results
    
    def execute_sql(self, query, params):
        # SQL injection vulnerability - no parameterized queries
        sql = f"SELECT * FROM users WHERE name = '{params['name']}'"
        # Simulated database execution
        print(f"Executing: {sql}")
        return []


def inefficient_data_processing():
    # Bad performance patterns
    data = []
    for i in range(10000):
        # Inefficient string concatenation
        result = ""
        for j in range(100):
            result = result + str(j)  # Should use join()
        data.append(result)
    return data


def main():
    """Main function to test various patterns."""
    # Test data with bare except clause
    sample_users = [
        {"name": "John", "email": "john@example.com", "age": 30},
        {"name": "Jane", "email": "jane@example.com", "age": 25}
    ]
    
    # Test function calls with poor exception handling
    try:
        users = process_user_data(sample_users)
        print(f"Processed {len(users)} users")
    except:  # Bare except clause - bad practice
        pass
    
    # Test potential error with empty list
    try:
        avg = calculate_average([])  # Will cause division by zero
        print(f"Average: {avg}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test security vulnerabilities
    try:
        data = unsafe_api_call("https://api.example.com/data")
        file_content = process_file_path("../../../etc/passwd")
    except:
        pass
    
    # Test class usage with SQL injection
    processor = DataProcessor("config.json")
    processor.execute_sql("SELECT", {"name": "'; DROP TABLE users; --"})
    
    # Test inefficient processing
    inefficient_data_processing()
    
    print("Test completed!")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Simple test file to verify Copilot code review functionality.

This file intentionally contains various code patterns to test if Copilot
provides different review comments for Python vs JavaScript files based on
the respective instruction files.
"""

import os
import json
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


class DataProcessor:
    """Simple data processor class."""
    
    def __init__(self, config_path):
        # Missing type hints
        self.config = self.load_config(config_path)
        self.processed_count = 0
    
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


def main():
    """Main function to test various patterns."""
    # Test data
    sample_users = [
        {"name": "John", "email": "john@example.com", "age": 30},
        {"name": "Jane", "email": "jane@example.com", "age": 25}
    ]
    
    # Test function calls
    users = process_user_data(sample_users)
    print(f"Processed {len(users)} users")
    
    # Test potential error
    try:
        avg = calculate_average([1, 2, 3, 4, 5])
        print(f"Average: {avg}")
    except Exception as e:
        print(f"Error: {e}")
    
    # Test class usage
    processor = DataProcessor("config.json")  # This will fail but tests error handling
    
    print("Test completed!")


if __name__ == "__main__":
    main()

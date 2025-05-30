# data_loading.py
import os
import json

def load_json_file(file_path):
    """Load a single JSON file."""
    with open(file_path, "r") as f:
        return json.load(f)

def load_all_json_files(directory):
    """Load all JSON files from a given directory."""
    json_objects = []
    print(f"\n🔍 Scanning directory: {os.path.abspath(directory)}")
    
    if not os.path.exists(directory):
        print(f"❌ Directory does not exist: {directory}")
        return json_objects

    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            file_path = os.path.join(directory, filename)
            print(f"📂 Found JSON file: {file_path}")
            try:
                json_obj = load_json_file(file_path)
                json_objects.append(json_obj)
                print(f"✅ Successfully loaded {filename}")
            except Exception as e:
                print(f"❌ Error loading {filename}: {str(e)}")
    return json_objects

# Test the loader
if __name__ == "__main__":
    directory = "../data"  # Create this directory and add some JSON files
    json_data = load_all_json_files(directory)
    print(f"Loaded {len(json_data)} JSON objects.")

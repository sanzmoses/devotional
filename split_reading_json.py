import json
import os

# Path to the source JSON file
source_file_path = 'src/data/reading.json'

# Directory to save the monthly files
output_directory = 'src/data/navigators-bible-plan'

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Read the source JSON file
with open(source_file_path, 'r') as file:
    data = json.load(file)

# Iterate over each month and save it to a separate file
for month_data in data:
    month_name = month_data['month']
    output_file_path = os.path.join(output_directory, f'{month_name}.json')
    
    with open(output_file_path, 'w') as output_file:
        json.dump(month_data, output_file, indent=2)

print("Monthly JSON files have been created successfully.")